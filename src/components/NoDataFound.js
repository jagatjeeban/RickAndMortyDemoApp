import React from "react";
import { View, Text, StyleSheet } from "react-native";

//import constants
import { Colors, FontFamily } from "../common/constants";

const NoDataFound = ({ title = 'No Data found!' }) => {
    return(
        <View style={styles.container}>
            <Text style={{color: Colors.Base_Medium_Grey, fontSize: 30, fontFamily: FontFamily.OutfitRegular}}>{title}</Text>
        </View>
    )
}

export default NoDataFound;

const styles = StyleSheet.create({
    container: {
        marginTop:'80%', 
        alignItems:'center', 
        justifyContent:"center"
    }
})