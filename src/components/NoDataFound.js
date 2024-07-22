import React from "react";
import { View, Text } from "react-native";

import { Colors, FontFamily } from "../common/constants";

const NoDataFound = ({ title = 'No Data found!' }) => {
    return(
        <View style={{marginTop:'80%', alignItems:'center', justifyContent:"center"}}>
            <Text style={{color: Colors.Base_Medium_Grey, fontSize: 30, fontFamily: FontFamily.OutfitRegular}}>{title}</Text>
        </View>
    )
}

export default NoDataFound;