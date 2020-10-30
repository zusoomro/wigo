import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Button,
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";

interface User {
  id: number;
  email: string;
}

const InviteUsers: React.FC<{}> = ({ navigation, route }) => {
  const u: User[] = [];
  const [users, setUsers] = useState(u);
  const [invitees, setInvitees] = useState([]);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await fetch("http://localhost:8000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        const json = await res.json();
        setUsers(json);
      } catch (err) {
        console.log("error loading users");
      }
    }

    fetcher();
  }, []);

  const Item = ({ title, user }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Button
        onPress={() => {
          const newInvite: Array<number> = [user.id];
          if (invitees) {
            setInvitees(invitees.concat(newInvite));
          } else {
            setInvitees(newInvite);
          }
        }}
        title="Select"
      ></Button>
    </View>
  );

  const renderItem = ({ item }) => <Item title={item.email} user={item} />;

  const handleInviteUsers = () => {
    navigation.navigate("CreatePod", { invitees: invitees });
    console.log("Invite Users button pressed: Send invites!!!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button onPress={handleInviteUsers} title="Send Invites"></Button>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => "" + item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#e6e6ff",
    justifyContent: "space-between",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
});

export default InviteUsers;
