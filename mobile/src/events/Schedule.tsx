import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Event from "./Event";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  const [isToggledToUser, setIsToggledToUser] = useState(true);

  const toggleSwitch = () =>
    setIsToggledToUser((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isToggledToUser ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isToggledToUser}
      />
      <Schedule isToggledToUser={isToggledToUser} />
      <Button
        title="Create Event"
        onPress={() => {
          console.log("Create New Event button clicked");
          navigation.navigate("CreateEvent");
          return;
        }}
      ></Button>
    </SafeAreaView>
  );
};

const Schedule: React.FC<{}> = ({ isToggledToUser }) => {
  const [events, setEvents] = useState([]);
  const [pod, setPod] = useState<Pod>();
  let today = new Date();

  React.useEffect(() => {
    if (isToggledToUser) {
      async function fetcher() {
        try {
          const authToken = await SecureStore.getItemAsync("wigo-auth-token");
          const res = await fetch("http://localhost:8000/events", {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": authToken!,
            },
          });
          const json = await res.json();
          const returnedEvents = json.events;
          if (returnedEvents) {
            setEvents(returnedEvents);
          }
        } catch (err) {
          console.log("ERROR: ", err);
          console.log("error loading events for current user");
        }
      }
      fetcher();
    } else {
      async function fetcher1() {
        try {
          const authToken = await SecureStore.getItemAsync("wigo-auth-token");
          const res = await fetch("http://localhost:8000/pods/currUsersPod", {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": authToken!,
            },
          });

          const json = await res.json();
          const returnedPod = json.pod;
          if (returnedPod) {
            setPod(returnedPod);
          }
        } catch (err) {
          console.log("error loading pod for current user");
        }
      }
      fetcher1();
      async function fetcher2() {
        try {
          const authToken = await SecureStore.getItemAsync("wigo-auth-token");
          const res = await fetch(`http://localhost:8000/events/${pod.id}`, {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": authToken!,
            },
          });

          const json = await res.json();
          const returnedEvents = json.events;
          if (returnedEvents) {
            setEvents(returnedEvents);
          }
        } catch (err) {
          console.log("error loading events for current pod");
        }
      }
      fetcher2();
    }
  }, [isToggledToUser]);

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  // need to add check that it is today

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {events.map((event) => (
          <Event
            event={event}
            showName={!isToggledToUser}
            key={event.id}
          ></Event>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  heading: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  normal: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 20,
  },
  sub: {
    fontSize: 10,
    textAlign: "left",
    marginBottom: 10,
  },
  scheduleItem: {
    flex: 1,
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
  },
});

export default ScheduleHomePage;
