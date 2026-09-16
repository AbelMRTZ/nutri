import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { FullScreenSpinner } from '@/components/full-screen-spinner';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { lookupBarcode } from '@/features/foods/api/openFoodFacts';
import { CreateFoodScreen } from '@/features/foods/components/CreateFoodScreen';
import { mapOpenFoodFactsProduct } from '@/features/foods/calculations/openFoodFactsMapping';
import type { FoodFormValues } from '@/features/foods/schema';
import { useTheme } from '@/hooks/use-theme';

type ScanState =
  | { phase: 'scanning' }
  | { phase: 'looking_up' }
  | { phase: 'found'; barcode: string; defaultValues: Partial<FoodFormValues> }
  | { phase: 'not_found' }
  | { phase: 'error' }
  | { phase: 'manual' };

/**
 * Camera-driven "Alimento por QR" flow: scans a product barcode, looks it up
 * against Open Food Facts, and lands on the exact same food-editing screen
 * used everywhere else, prefilled with whatever nutrition data is
 * available. Never navigates away — the create-food screen renders in
 * place once a product is found, so "back" from it always returns to
 * wherever this screen was pushed from.
 */
export function ScanBarcodeScreen() {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<ScanState>({ phase: 'scanning' });
  const lockedRef = useRef(false);

  function resetToScanning() {
    lockedRef.current = false;
    setState({ phase: 'scanning' });
  }

  async function handleScanned(result: BarcodeScanningResult) {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setState({ phase: 'looking_up' });

    const lookup = await lookupBarcode(result.data);
    if (lookup.status === 'not_found') {
      setState({ phase: 'not_found' });
      return;
    }
    if (lookup.status === 'error') {
      setState({ phase: 'error' });
      return;
    }

    const defaultValues = mapOpenFoodFactsProduct(lookup.product);
    setState({ phase: 'found', barcode: result.data, defaultValues });
  }

  if (state.phase === 'found') {
    return <CreateFoodScreen defaultValues={state.defaultValues} sourceBarcode={state.barcode} />;
  }
  if (state.phase === 'manual') {
    return <CreateFoodScreen defaultValues={{}} />;
  }

  if (!permission) {
    return <FullScreenSpinner />;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
            {permission.canAskAgain
              ? 'Necesitamos acceso a la cámara para escanear el código de barras de un producto.'
              : 'El acceso a la cámara está desactivado. Actívalo desde los ajustes del sistema para escanear un producto.'}
          </ThemedText>
          {permission.canAskAgain ? (
            <Button title="Dar acceso a la cámara" onPress={requestPermission} />
          ) : (
            <Button title="Abrir ajustes" onPress={() => Linking.openSettings()} />
          )}
        </View>
      </Screen>
    );
  }

  if (state.phase === 'not_found' || state.phase === 'error') {
    return (
      <Screen>
        <View style={styles.centeredMessage}>
          <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
            {state.phase === 'not_found'
              ? 'No hemos encontrado este producto en Open Food Facts.'
              : 'No se pudo conectar con Open Food Facts. Comprueba tu conexión.'}
          </ThemedText>
          <Button title="Reintentar escaneo" onPress={resetToScanning} />
          <Button
            variant="secondary"
            title="Añadir manualmente"
            onPress={() => setState({ phase: 'manual' })}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr'] }}
        onBarcodeScanned={state.phase === 'scanning' ? handleScanned : undefined}
      />
      <View style={styles.overlay} pointerEvents="none">
        <View style={[styles.viewfinder, { borderColor: theme.onPrimary }]} />
        <ThemedText type="default" style={[styles.overlayText, { color: theme.onPrimary }]}>
          Apunta al código de barras del producto
        </ThemedText>
      </View>
      {state.phase === 'looking_up' ? (
        <View style={[styles.overlay, styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
          <ActivityIndicator color={theme.onPrimary} size="large" />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  centeredMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  centerText: {
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingOverlay: {
    zIndex: 10,
  },
  viewfinder: {
    width: '75%',
    aspectRatio: 1.6,
    borderWidth: 2,
    borderRadius: 16,
  },
  overlayText: {
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
