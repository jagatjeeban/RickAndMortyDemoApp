import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';

//import constants
import { Colors, FontFamily, Strings } from '../common/constants'

//import components
import { PageHeader, NoDataFound } from '../components';

//import custom functions
import { getFirstLetterUc } from '../common/customFun';

//import base api
import { getCharactersGetAPI } from '../apis';

const Characters = ({ navigation }) => {

  //states
  const [ charactersList, setCharactersList ]             = useState([]);
  const [ filteredCharacters, setFilteredCharacters ]     = useState([]);
  const [ loaderStatus, setLoaderStatus ]                 = useState(false);
  const [ pageNumber, setPageNumber ]                     = useState(1);
  const [ totalCount, setTotalCount ]                     = useState(0);

  //character card item component
  const CharacterCardItem = ({item, index}) => {

    //function to get the status color
    const getStatusColor = () => {
      if(item?.status === 'Alive'){
        return Colors.Base_Green;
      }
      else if(item?.status === 'Dead'){
        return Colors.Base_Red;
      }
      else {
        return Colors.Base_Medium_Grey;
      }
    }

    return(
      <TouchableOpacity activeOpacity={0.7} key={index} onPress={() => navigation.navigate('CharacterProfile', { pageTitle: item?.name, characterId: item?.id })} style={styles.cardItemContainer}>
        <Image source={{uri: item?.image}} style={styles.cardImageStyle} resizeMode={'cover'} />
        <LinearGradient
          colors={['transparent', Colors.Base_Gradient]}
          style={styles.cardGradient}
        />
        <View style={styles.characterInfoContainer}>
          <Text numberOfLines={2} style={styles.characterNameStyle}>{item?.name}</Text>
          <View style={[styles.rowContainer, {justifyContent:"space-between", marginTop: 5}]}>
            <Text style={styles.characterGenderStyle}>{getFirstLetterUc(item?.gender)}</Text>
            <View style={styles.rowContainer}>
              <View style={[styles.characterStatusDot, {backgroundColor: getStatusColor(item?.status)}]} />
              <Text style={[styles.characterGenderStyle, {color: getStatusColor(item?.status)}]}>{getFirstLetterUc(item?.status)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  //function to get all the characters
  const getCharacters = async() => {
    setLoaderStatus(true);
    let param = `/character/?page=1`;
    let response = await getCharactersGetAPI(param);
    setLoaderStatus(false);
    if(response?.statusCode === 200){
      setFilteredCharacters(response?.data?.results);
      setPageNumber(2);
      setTotalCount(response?.data?.info?.count);
    } else {
      showMessage({message: Strings.ErrMsg, description: `Couldn't fetch the charcters.`, type:'danger', icon:'info'});
    }
  }

  //function to load more characters 
  const getPaginatedCharacters = async() => {
    let param = `/character/?page=${pageNumber}`;
    let response = await getCharactersGetAPI(param);
    if(response?.statusCode === 200){
      setCharactersList([...charactersList, ...response?.data?.results]);
      setPageNumber(pageNumber+1);
    } else {
      showMessage({message: Strings.ErrMsg, description: `Couldn't load more charcters.`, type:'danger', icon:'info'});
    }
  }

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={'Ricky & Morty Characters'} iconArr={['search']} searchEvent={(req) => null} navigation={navigation} />
      <View style={{flex: 1}}>
        {loaderStatus? 
          <View style={{flex: 1, alignItems:'center', justifyContent:"center"}}>
            <ActivityIndicator size={'large'} color={Colors.Base_Medium_Grey} />
          </View>
        :
          <FlatList
            data={filteredCharacters}
            numColumns={2}
            columnWrapperStyle={{justifyContent:'space-between'}}
            showsVerticalScrollIndicator={true}
            refreshing={loaderStatus}
            onRefresh={() => getCharacters()}
            onEndReachedThreshold={0.3}
            onEndReached={() => filteredCharacters?.length > 0 && filteredCharacters?.length < totalCount? getPaginatedCharacters(): null}
            contentContainerStyle={{justifyContent:"space-between", marginHorizontal: 20}}
            renderItem={CharacterCardItem}
            ListHeaderComponent={<View style={styles.height20} />}
            ListFooterComponent={
              filteredCharacters?.length > 0 && filteredCharacters?.length < totalCount? 
                <View style={{paddingVertical: 20}}>
                  <ActivityIndicator size={'large'} color={Colors.Base_Medium_Grey} />
                </View>
              :
              <View style={styles.height20} />
            }
            ItemSeparatorComponent={<View style={styles.height20} />}
            ListEmptyComponent={<NoDataFound title={'No Character found!'} />}
          />
        }
      </View>
    </SafeAreaView>
  )
}

export default Characters

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.BgColor
  },
  height20: {
    height: 20
  },
  cardItemContainer: {
    width: '47%', 
    height: 250, 
    borderRadius: 20, 
    backgroundColor: Colors.Base_Grey,
    overflow:"hidden"
  },
  cardImageStyle: {
    height: '100%', 
    width:'100%', 
    borderRadius: 20
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20
  },
  characterInfoContainer: {
    position:"absolute", 
    bottom: 0, 
    paddingHorizontal: 15, 
    paddingBottom: 15, 
    width:'100%'
  },
  characterNameStyle: {
    color: Colors.Base_White, 
    fontFamily: FontFamily.OutfitMedium, 
    fontSize: 18,
  },
  characterGenderStyle: {
    color: Colors.Base_White, 
    fontFamily: FontFamily.OutfitRegular, 
    fontSize: 15
  },
  characterStatusDot: {
    width: 7, 
    height: 7, 
    borderRadius: 50, 
    marginRight: 5
  },
  rowContainer: {
    flexDirection:'row',
    alignItems:'center'
  },
})