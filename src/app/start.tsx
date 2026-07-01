import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import {
  Camera,
  CloseSquare,
  Gallery,
  Link,
  Magicpen,
  Save2,
  Share,
  Text as TextIcon,
} from 'iconsax-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import {
  Button,
  FocusAwareStatusBar,
  Input,
  Modal,
  ModeCard,
  Text as TextComponent,
  useModal,
  View,
} from '@/components/ui';

type GenerationMode = 'text' | 'url' | 'image' | 'contact';

export default function QRGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const qrRef = useRef(null);

  const { ref: modalRef, present, dismiss } = useModal();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      return result.assets[0].base64;
    }
    return null;
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      return result.assets[0].base64;
    }
    return null;
  };

  const generateQR = async () => {
    if (generationMode === 'image') {
      if (!selectedImage) {
        alert('Veuillez sélectionner une image');
        return;
      }
      setQrValue(selectedImage);
    } else if (!inputText.trim()) {
      alert('Veuillez entrer un texte ou une URL');
      return;
    } else {
      setQrValue(inputText);
    }
    present();
    startAnimation();
  };

  const clearAll = () => {
    setInputText('');
    setQrValue('');
    setSelectedImage(null);
    dismiss();
  };

  const startAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    rotateAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const shareQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const saveToGallery = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(uri, { dialogTitle: 'Enregistrer le QR Code' });
    } catch (error) {
      console.error('Error saving QR code:', error);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#090D12]">
      <FocusAwareStatusBar />

      <View className="flex-1 p-4">
        <TextComponent className="mb-6 text-center text-2xl font-bold text-white">
          Générateur QR Code
        </TextComponent>

        <TextComponent className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#8F98AB]">
          Type de contenu
        </TextComponent>
        <View className="-mx-2 mb-4 flex-row">
          <ModeCard
            icon={TextIcon}
            title="Texte"
            mode="text"
            description="Générer à partir d'un texte"
            currentMode={generationMode}
            onPress={(mode) => setGenerationMode(mode as GenerationMode)}
          />
          <ModeCard
            icon={Link}
            title="URL"
            mode="url"
            description="Générer à partir d'un lien"
            currentMode={generationMode}
            onPress={(mode) => setGenerationMode(mode as GenerationMode)}
          />
        </View>
        <View className="-mx-2 mb-6 flex-row">
          <ModeCard
            icon={Gallery}
            title="Image"
            mode="image"
            description="Générer à partir d'une image"
            currentMode={generationMode}
            onPress={(mode) => setGenerationMode(mode as GenerationMode)}
          />
          <ModeCard
            icon={Camera}
            title="Contact"
            mode="contact"
            description="Générer une carte de contact"
            currentMode={generationMode}
            onPress={(mode) => setGenerationMode(mode as GenerationMode)}
          />
        </View>

        {generationMode === 'image' ? (
          <View className="mb-6">
            {selectedImage ? (
              <View className="mb-4 items-center">
                <Image
                  source={{ uri: selectedImage }}
                  className="mb-3 size-32 rounded-2xl"
                />
                <Button
                  label="Changer d'image"
                  onPress={pickImage}
                  variant="outline"
                  className="mb-2 border border-white/10 bg-white/5"
                  textClassName="text-white"
                  size="sm"
                />
              </View>
            ) : (
              <View className="flex-row justify-between gap-3">
                <Button
                  label="Importer"
                  onPress={pickImage}
                  className="flex-1 bg-[#FF8933]"
                  textClassName="text-white"
                  size="sm"
                  icon={
                    <Gallery
                      variant="Bold"
                      size="16"
                      color="white"
                      className="mr-1"
                    />
                  }
                />
                <Button
                  label="Photo"
                  onPress={takePhoto}
                  className="flex-1 bg-[#FF8933]"
                  textClassName="text-white"
                  size="sm"
                  icon={
                    <Camera
                      variant="Bold"
                      size="16"
                      color="white"
                      className="mr-1"
                    />
                  }
                />
              </View>
            )}
          </View>
        ) : (
          <Input
            label={
              generationMode === 'url'
                ? 'Entrez votre URL'
                : 'Entrez votre texte'
            }
            placeholder={
              generationMode === 'url'
                ? 'Ex: https://obytes.com'
                : 'Ex: Mon texte secret'
            }
            value={inputText}
            onChangeText={setInputText}
            keyboardType={generationMode === 'url' ? 'url' : 'default'}
          />
        )}

        <View className="mt-2 flex-row justify-between gap-3">
          <Button
            label="Générer"
            onPress={generateQR}
            disabled={
              (generationMode !== 'image' && !inputText.trim()) ||
              (generationMode === 'image' && !selectedImage)
            }
            className="flex-1 bg-[#FF8933]"
            textClassName="text-white"
            icon={
              <Magicpen
                variant="Bold"
                size="20"
                color="white"
                className="mr-2"
              />
            }
          />
          <Button
            label="Effacer"
            onPress={clearAll}
            variant="outline"
            className="flex-1 border border-white/10 bg-white/5"
            textClassName="text-white"
            icon={
              <CloseSquare
                variant="Bold"
                size="20"
                color="#8F98AB"
                className="mr-2"
              />
            }
          />
        </View>
      </View>

      <Modal
        ref={modalRef}
        snapPoints={['65%']}
        title="Votre QR Code est prêt"
        detached={true}
        backgroundStyle={{ backgroundColor: '#0D1219' }}
        onDismiss={clearAll}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
          }}
          className="items-center p-4"
        >
          <View ref={qrRef} className="mb-4 rounded-2xl bg-white p-6 shadow-lg">
            <QRCode
              value={qrValue}
              size={180}
              backgroundColor="white"
              color="black"
            />
          </View>

          <View className="mt-4 w-full flex-row gap-3 px-4">
            <Button
              label="Partager"
              onPress={shareQRCode}
              size="md"
              className="flex-1 bg-[#FF8933]"
              textClassName="text-white"
              icon={
                <Share
                  variant="Bold"
                  size="20"
                  color="white"
                  className="mr-2"
                />
              }
            />
            <Button
              label="Enregistrer"
              onPress={saveToGallery}
              variant="glass"
              size="md"
              className="flex-1"
              textClassName="text-white"
              icon={
                <Save2
                  variant="Bold"
                  size="20"
                  color="white"
                  className="mr-2"
                />
              }
            />
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}
