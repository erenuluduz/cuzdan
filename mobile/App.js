import React, { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function App() {
  const webViewRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dinamik olarak geliştirme yapılan bilgisayarın yerel IP adresini tespit et
  const getAppUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3000`;
    }
    return 'http://192.168.1.86:3000';
  };

  const appUrl = getAppUrl();

  const handleRetry = () => {
    setHasError(false);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      <View style={styles.container}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Bağlantı Kurulamadı</Text>
            <Text style={styles.errorText}>
              Uygulama sunucusuna ({appUrl}) erişilemedi. Lütfen bilgisayarınız ile telefonunuzun aynı Wi-Fi ağına bağlı olduğundan ve yerel sunucunun çalıştığından emin olun.
            </Text>
            {errorMessage ? (
              <Text style={styles.errorDetail}>{errorMessage}</Text>
            ) : null}
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Yeniden Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: appUrl }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            originWhitelist={['*']}
            mixedContentMode="always"
            allowsBackForwardNavigationGestures={true}
            bounces={false}
            overScrollMode="never"
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text style={styles.loadingText}>Bütçe & Net Varlık Yükleniyor...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setErrorMessage(nativeEvent.description || '');
              setHasError(true);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f87171',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  errorDetail: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
