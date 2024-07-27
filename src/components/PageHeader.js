import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { useIsFocused } from "@react-navigation/native";

//import constants
import { Colors, FontFamily } from "../common/constants";

//import svgs
import SvgBackArrow       from '../assets/icons/svg/backArrow.svg';
import SvgBackGrey        from '../assets/icons/svg/backArrowGrey.svg';
import SvgSearch          from '../assets/icons/svg/searchWhite.svg';
import SvgCross           from '../assets/icons/svg/crossGrey.svg';
import SvgFilter          from '../assets/icons/svg/filter.svg';

const PageHeader = ({navigation, placeholder='Search', headerTitle=null, headerTitleColor=Colors.Base_White, iconArr=[], backBtn=false, searchBlur=null, searchEvent=null, clickEvent=null}) => {
    
    //states
    const [ searchStatus, setSearchStatus ] = useState(false);
    const [ searchInput, setSearchInput ]   = useState('');
    
    //refs
    const searchRef                       = useRef();

    const isFocused = useIsFocused();
    
    //function to handle system back press event
    const handleBackPress = () => {
        if(searchStatus){
            setSearchStatus(false);
            searchEvent('');
            setSearchInput('');
            return true;
        }
        return false;
    }

    useEffect(()=>{
        if(isFocused){
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => backHandler.remove();
        }
    }, [searchStatus, isFocused]);

    useEffect(() => {
        if(searchStatus){
            searchRef?.current?.focus();
        }
    }, [searchStatus]);    
    
    return(
        <View style={styles.body}>
            {!searchStatus? 
                <View style={{flex: 1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row', alignItems:'center', maxWidth:"85%"}}>
                        {backBtn? 
                        <>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 20}}>
                                <SvgBackArrow />
                            </TouchableOpacity>
                            <View style={{paddingVertical: 20}}>
                                <Text style={{color: headerTitleColor, fontSize: 20, fontFamily: FontFamily.OutfitMedium}}>{headerTitle}</Text>
                            </View>
                        </>
                        :
                        <Text style={{color: headerTitleColor, fontSize: 20, fontFamily: FontFamily.OutfitMedium, padding: 20}}>{headerTitle}</Text>}
                    </View>
                    {iconArr?.length > 0? 
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            { iconArr.some((item) => item === 'search')?
                                <TouchableOpacity style={styles.iconStyle} onPress={() => setSearchStatus(!searchStatus)}>
                                    <SvgSearch width={20} height={20} />
                                </TouchableOpacity>
                            : null }
                            {/* { iconArr.some((item) => item === 'filter')? 
                                <TouchableOpacity style={styles.iconStyle} onPress={() => clickEvent()}>
                                    <SvgFilter width={20} height={20} />
                                </TouchableOpacity>
                            : null} */}
                        </View>
                    : null}
                </View>
            :
            <View style={styles.searchInputContainer}>
                <View style={{flexDirection:'row', alignItems:"center", width:"87%"}}>
                    <TouchableOpacity onPress={() => [setSearchStatus(!searchStatus), searchEvent(''), setSearchInput('')]} style={{padding: 20}}>
                        <SvgBackGrey />
                    </TouchableOpacity>
                    <TextInput
                        ref={searchRef}
                        placeholder={placeholder}
                        selectionColor={Colors.Primary}
                        placeholderTextColor={Colors.Base_Medium_Grey}
                        value={searchInput}
                        autoFocus={true}
                        style={{color: Colors.Base_White, fontSize: 18, fontFamily: FontFamily.OutfitRegular, paddingVertical:20, width:'85%'}}
                        onBlur={() => { if(searchBlur) searchBlur() }}
                        onChange={(e) => [searchEvent(e.nativeEvent.text), setSearchInput(e.nativeEvent.text)]}
                    />
                </View>
                {searchInput !== ''? 
                    <TouchableOpacity onPress={() => [searchEvent(''), setSearchInput('')]} style={{padding:20}}>
                        <SvgCross />
                    </TouchableOpacity>
                : null}
            </View>}
        </View>
    )
}

export default PageHeader;

const styles = StyleSheet.create({
    body: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center',
    },
    iconStyle: {
        paddingRight: 20, 
        paddingVertical: 20
    },
    searchInputContainer: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems:"center", 
        justifyContent:"space-between", 
        borderBottomWidth: 1, 
        borderColor: Colors.Base_Grey, 
        marginBottom:1
    }
})