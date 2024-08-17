import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native'
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
  const [ allcount, setAllCount ]                         = useState(0);
  const [ searchInput, setSearchInput ]                   = useState('');

  //character card item component
  const CharacterCardItem = ({item, index}) => {

    //function to get the character status (e.g. Alive, Dead) color
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
      <TouchableOpacity activeOpacity={1} key={index} onPress={() => navigation.navigate('CharacterProfile', { pageTitle: item?.name, characterId: item?.id })} style={styles.cardItemContainer}>
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
    const param = `/character/?page=1`;
    const response = await getCharactersGetAPI(param);
    setLoaderStatus(false);
    if(response?.statusCode === 200){
      setCharactersList(response?.data?.results);
      setFilteredCharacters(response?.data?.results);
      setPageNumber(2);
      setTotalCount(response?.data?.info?.count);
      setAllCount(response?.data?.info?.count);
    } else {
      showMessage({message: Strings.ErrMsg, description: Strings.ErrDescription, type:'danger', icon:'info'});
    }
  }

  //function to load more characters 
  const getPaginatedCharacters = async() => {
    const param = `/character/?page=${pageNumber}&name=${searchInput}`;
    const response = await getCharactersGetAPI(param);
    if(response?.statusCode === 200){
      setFilteredCharacters([...filteredCharacters, ...response?.data?.results]);
      setPageNumber(pageNumber+1);
    } else {
      showMessage({message: Strings.ErrMsg, description: Strings.ErrDescription, type:'danger', icon:'info'});
    }
  }

  //function to search the characters
  const searchEvent = async(req) => {
    if(req === ''){
      setSearchInput('');
      setTotalCount(allcount);
      setFilteredCharacters(charactersList);
    } else {
      setLoaderStatus(true);
      setSearchInput(req);
      const param = `/character/?name=${req}`;
      const response = await getCharactersGetAPI(param);
      setLoaderStatus(false);
      if(response?.statusCode === 200){
        setFilteredCharacters(response?.data?.results);
        setTotalCount(response?.data?.info?.count);
        setPageNumber(2);
      } else {
        setFilteredCharacters([]);
      }
    }
  }

  useEffect(() => {
    getCharacters();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={Strings.HeaderTitle} iconArr={['search', 'filter']} searchEvent={(req) => searchEvent(req)} clickEvent={() => alert('clicked')} navigation={navigation} />
      <View style={{flex: 1}}>
        {loaderStatus? 
          <View style={styles.loaderStyle}>
            <ActivityIndicator size={'large'} color={Colors.Base_Medium_Grey} />
          </View>
        :
          <FlatList
            data={filteredCharacters}
            numColumns={2}
            columnWrapperStyle={{justifyContent:'space-between'}}
            refreshControl={
              <RefreshControl
                refreshing={loaderStatus}
                onRefresh={searchInput === ''? () => getCharacters(): false}
                progressBackgroundColor={Colors.Base_Grey}
                colors={[Colors.Base_White]}
              />
            }
            onEndReachedThreshold={0.3}
            onEndReached={() => filteredCharacters?.length > 0 && filteredCharacters?.length < totalCount? getPaginatedCharacters(searchInput): null}
            contentContainerStyle={styles.flatlistStyle}
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
            keyExtractor={(_, index) => index.toString()}
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
  flatlistStyle: {
    justifyContent:"space-between", 
    marginHorizontal: 20
  },
  loaderStyle: {
    flex: 1, 
    alignItems:'center', 
    justifyContent:"center"
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