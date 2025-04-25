import React, { useState } from "react";
import {TouchableOpacity, Image, StyleSheet} from "react-native";
import { useRouter } from "expo-router";



const BackArrow = () => {
    const router = useRouter();

    const handleGoBack = () => router.back();

    console.log(router);

    return (
        <TouchableOpacity onPress={handleGoBack} style={styles.arrowIcon}>
            <Image source={require("../../assets/images/backArrow.png")} style={styles.arrowSize} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    arrowIcon: { position: "absolute", top: 10, left: 20 },
    arrowSize: { width: 90, height: 50 },
});

export default BackArrow;