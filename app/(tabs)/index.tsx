import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Carousel from "react-native-reanimated-carousel";

interface ImageData {
  uri: string;
}

export default function CarouselScreen() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      console.log("new here");
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  let pickImages;
  try {
    pickImages = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.cancelled) {
        const selectedImages = result.assets?.map((asset) => asset.uri) || [];
        setImages(selectedImages);
      }
    };
  } catch (err) {
    console.log({ err });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Carousel</Text>
      <Button title="Pick Images" onPress={pickImages} />

      {images.length > 0 ? (
        <Carousel
          loop
          width={Dimensions.get("window").width}
          height={300}
          autoPlay={true}
          data={images}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.placeholder}>No images selected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  placeholder: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "auto",
    height: 300,
    borderRadius: 10,
  },
});
