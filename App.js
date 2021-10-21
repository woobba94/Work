import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, AsyncStorage, ScrollView, StyleSheet, Text, TextInput, TouchableHighlightComponent, TouchableOpacity, View } from 'react-native';
import { theme } from './colors';

const STORAGE_KEY="@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({})
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if(s){ 
      setToDos(JSON.parse(s));
    }
   
  };
  useEffect(() => {
    loadToDos();
  }, []);

  const addToDo = async () => {
    if(text === ""){
      return;
    }
    const newTodos = {
      ...toDos,
      [Date.now()] : {text, working},
  };
    
    setToDos(newTodos);
    await saveToDos(newTodos);
    setText("");
  };

  const deleteToDo = (key) => {
    Alert.alert(
      "ToDo 삭제", 
      "정말 삭제하시겠습니까?",[
      {text:"취소"},
      {
        text:"삭제", 
        onPress: () => {
          // state 는 절대 변형할 수 없음.
          // 그래서 기존 오브젝트를 새로운 오브젝트에 복사
          const newToDos = {...toDos};
          // 새로운 오브젝트에서 해당 key delete
          delete newToDos[key];
          
          // 리로드
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress = {work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText} 
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
          style = {styles.input}/>
        <ScrollView>
          {Object.keys(toDos).map((key) => 
            toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Text>🗑</Text>
              </TouchableOpacity>
            </View> 
            ): null
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    justifyContent:"space-between",
    flexDirection: "row",
    marginTop: 100,
  },

  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo:{
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical:20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
