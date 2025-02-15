import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

GoogleSignin.configure({
  webClientId:
    "777230895589-ceku3uhscgelacfo9l06pk3ii5jo04mm.apps.googleusercontent.com",
  scopes: ["profile", "email"],
});

const AuthComponent = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const handleFormSubmit = () => {
    if (isSignUp) {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() =>  router.replace('/home')) 
        .catch((err) => console.log(err));
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => router.replace('/home')) 
        .catch((err) => console.log(err));
    }
  };

  function onAuthStateChanged(user) {
    setUser(user);
    if (user)  router.replace('/home'); 
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const googleSignInResult = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      googleSignInResult.idToken
    );
    await auth().signInWithCredential(googleCredential);
    router.replace('/home'); 
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isSignUp ? "Sign Up" : "Sign In"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button title={isSignUp ? "Sign Up" : "Sign In"} onPress={handleFormSubmit} />

      <Button
        title={isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        onPress={() => setIsSignUp(!isSignUp)}
      />

      <Button title="Sign In with Google" color="#4285F4" onPress={onGoogleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AuthComponent;
