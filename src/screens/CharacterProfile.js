import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { showMessage } from 'react-native-flash-message';

//import constants
import { Colors, FontFamily, Strings } from '../common/constants';

//import components
import { PageHeader } from '../components';

//import custom functions
import { getFirstLetterUc, validateString, getIdFromUrl } from '../common/customFun';

//import apis
import { getCharactersGetAPI } from '../apis';

const CharacterProfile = ({ navigation, route }) => {

  //states
  const [ pageTitle, setPageTitle ]             = useState('');
  const [ characterInfo, setCharacterInfo ]     = useState(null);
  const [ noOfResidents, setNoOfResidents ]     = useState(null);
  const [ episodeList, setEpisodeList ]         = useState([]);
  const [ loaderStatus, setLoaderStatus ]       = useState(false);

  //character card item component
  const CharacterCardItem = () => {

    //function to get the status color
    const getStatusColor = () => {
      if(characterInfo?.status === 'Alive'){
        return Colors.Base_Green;
      }
      else if(characterInfo?.status === 'Dead'){
        return Colors.Base_Red;
      }
      else {
        return Colors.Base_Medium_Grey;
      }
    }

    return(
      <View style={styles.cardItemContainer}>
        <Image source={{uri: characterInfo?.image}} style={styles.cardImageStyle} resizeMode={'cover'} />
        <LinearGradient
          colors={['transparent', Colors.Base_Gradient]}
          style={styles.cardGradient}
        />
        <View style={styles.characterInfoContainer}>
          <Text numberOfLines={2} style={styles.characterNameStyle}>{characterInfo?.name}</Text>
          <View style={[styles.rowContainer, {justifyContent:"space-between", marginTop: 5}]}>
            <Text style={styles.characterGenderStyle}>{getFirstLetterUc(characterInfo?.gender)}</Text>
            <View style={styles.rowContainer}>
              <View style={[styles.characterStatusDot, {backgroundColor: getStatusColor(characterInfo?.status)}]} />
              <Text style={[styles.characterGenderStyle, {color: getStatusColor(characterInfo?.status)}]}>{getFirstLetterUc(characterInfo?.status)}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  //character data item component
  const CharacterDataItem = ({ title, value }) => {
    return(
      <View style={styles.rowDataContainer}>
        <View style={[styles.rowContainer, styles.width50]}>
          <Text numberOfLines={2} style={styles.characterDataTextStyle}>{title}</Text>
        </View>
        <View style={[styles.rowContainer, styles.width50]}>
          <Text style={styles.characterDataTextStyle}>:</Text>
          <Text numberOfLines={null} style={[styles.characterDataTextStyle, { marginLeft: 20 }]}>{value}</Text>
        </View>
      </View>
    )
  }

  //episode item component
  const EpisodeItem = ({item, index}) => {
    return(
      <View key={index} style={{paddingVertical: 10, flexDirection:'row'}}>
        <Text style={styles.characterDataTextStyle}>{`${index+1}. `}</Text>
        <Text numberOfLines={null} style={styles.characterDataTextStyle}>{`${validateString(item?.name)} (${item?.episode})`}</Text>
      </View>
    )
  }

  //function to get the character details
  const getCharacterDetails = async() => {
    setLoaderStatus(true);
    let param = `/character/${route?.params?.characterId}`;
    let response = await getCharactersGetAPI(param);
    setLoaderStatus(false);
    if(response?.statusCode === 200){
      setCharacterInfo(response?.data);
      getNoOfResidents(getIdFromUrl(response?.data?.location?.url));
      let episodeIds = response?.data?.episode?.map(episode => getIdFromUrl(episode));
      episodeIds.map(async id => {
        let episode = await getCharactersGetAPI(`/episode/${id}`);
        episodeList.push({ name: episode?.data?.name, episode: episode?.data?.episode });
      });
    } else {
      showMessage({message: Strings.ErrMsg, description: `Couldn't fetch the character details.`, type:'danger', icon:'info'});
    }
  }

  //function to get the number of residents
  const getNoOfResidents = async(id) => {
    let param = `/location/${id}`;
    let response = await getCharactersGetAPI(param);
    if(response?.statusCode === 200){
      setNoOfResidents(response?.data?.residents?.length);
    }
  }

  useEffect(() => {
    setPageTitle(route?.params?.pageTitle);
    getCharacterDetails();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={pageTitle} backBtn navigation={navigation} />
      {loaderStatus? 
        <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator size={'large'} color={Colors.Base_Medium_Grey} />
        </View>
      :
        <FlatList
          data={[1]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 30}}
          renderItem={() => 
            <>
              <CharacterCardItem />
              <View style={{marginHorizontal: 30}}>
                <CharacterDataItem title={'Species'}           value={validateString(characterInfo?.species)} />
                <CharacterDataItem title={'Type'}              value={validateString(characterInfo?.type)} />
                <CharacterDataItem title={'Origin'}            value={validateString(characterInfo?.origin?.name)} />
                <CharacterDataItem title={'Current Location'}  value={validateString(characterInfo?.location?.name)} />
                <CharacterDataItem title={'No. of Residents'}  value={validateString(noOfResidents)} />
                <CharacterDataItem title={'Featured Episodes'} value={''} />
                <FlatList
                  data={episodeList}
                  showsVerticalScrollIndicator={false}
                  renderItem={EpisodeItem}
                  keyExtractor={(_, index) => index.toString()}
                />
              </View>
            </>
          }
          keyExtractor={(_, index) => index.toString()}
        />
      }
    </SafeAreaView>
  )
}

export default CharacterProfile;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.BgColor
  },
  cardItemContainer: {
    margin: 20,
    height: 400, 
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
    paddingHorizontal: 25, 
    paddingBottom: 25, 
    width:'100%'
  },
  characterNameStyle: {
    color: Colors.Base_White, 
    fontFamily: FontFamily.OutfitMedium, 
    fontSize: 25,
  },
  characterGenderStyle: {
    color: Colors.Base_White, 
    fontFamily: FontFamily.OutfitRegular, 
    fontSize: 18
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
  rowDataContainer: {
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingVertical: 15
  },
  width50: {
    width:'50%'
  },
  width60: {
    width:'60%'
  },
  width40: {
    width:'40%'
  },
  characterDataTextStyle: {
    color: Colors.Base_White, 
    fontFamily: FontFamily.OutfitRegular, 
    fontSize: 20
  },
})