import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native'
import React from 'react'

//import constants
import { Colors, FontFamily } from '../common/constants'

//import components
import { PageHeader } from '../components';

const Characters = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <PageHeader headerTitle={'Ricky & Morty Characters'} iconArr={['search']} searchEvent={(req) => null} navigation={navigation} />
      <View style={{flex: 1, marginHorizontal: 20}}>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          numColumns={2}
          columnWrapperStyle={{justifyContent:'space-between'}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{justifyContent:"space-between"}}
          renderItem={() => 
            <View style={{width: '47%', height: 200, borderRadius: 20, backgroundColor: Colors.Base_Grey}} >
            </View>
          }
          ListHeaderComponent={<View style={styles.height20} />}
          ListFooterComponent={<View style={styles.height20} />}
          ItemSeparatorComponent={<View style={styles.height20} />}
        />
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
  }
})