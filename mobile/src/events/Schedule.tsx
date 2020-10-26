// display a schedule (personal, toggle to pod)
// pull events from DB
// look into calendar packages
// maybe make event component
// add type annotation to component

import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-elements";

const Schedule: React.FC<{}> = () => {
  console.log("HELLO in schedule");
  const sampleEvents = [
    {
      start_time: new Date("2020-03-26T09:30:00"),
      end_time: new Date("2020-03-26T10:00:00"),
      name: "Event 1",
      id: 1,
      ownerId: 1,
      address: "my butt",
      notes: "booty",
    },
    {
      start_time: new Date("2020-03-26T11:00:00"),
      end_time: new Date("2020-03-26T13:00:00"),
      name: "Event 2",
      id: 2,
      ownerId: 1,
      address: "ur butt",
      notes: "boooty",
    },
    {
      start_time: new Date("2020-03-26T15:00:00"),
      end_time: new Date("2020-03-26T16:30:00"),
      name: "Event 3",
      id: 3,
      ownerId: 1,
      address: "his butt",
      notes: "booooty",
    },
    {
      start_time: new Date("2020-03-26T18:00:00"),
      end_time: new Date("2020-03-26T19:00:00"),
      name: "Event 4",
      id: 4,
      ownerId: 1,
      address: "her butt",
      notes: "booooty",
    },
    {
      start_time: new Date("2020-03-26T22:00:00"),
      end_time: new Date("2020-03-26T23:30:00"),
      name: "Event 5",
      id: 5,
      ownerId: 1,
      address: "ur MOMs butt",
      notes: "boooooty",
    },
  ];

  const currUserId = 2; // will change when Zulfi sets local state / token contains id?

  // eventsForUser will store the array if events of the current user
  // const [eventsForUser, setEventsForUser] = useState(sampleEvents);
  const [eventsForUser, setEventsForUser] = useState([]);
  let today = new Date();

  useEffect(() => {
    fetch(
      // add in API
      `http://localhost:8000/events/${currUserId}`,
      {
        method: "GET",
      }
    )
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then((res) => {
        if (res) {
          console.log("yoyoyo");
          res.forEach((e) => {
            console.log("startTime for event: ", e.start_time);
            if (e.start_time.getDate() !== today.getDate()) {
              console.log("today is not today");
              res.remove(e);
            }
          });
          // sort events by start_time
          setEventsForUser(res);
        } else {
          setEventsForUser([]);
        }
      });
  });

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {/* CHANGE TO eventsForUser */}
        {/* {sampleEvents.map((event) => (
          <Event event={event}></Event>
        ))} */}
        {eventsForUser.map((event) => (
          <Event event={event}></Event>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Event: React.FC<{
  event: {
    name: string;
    start_time: Date;
    end_time: Date;
    notes: string;
    address: string;
    id: number;
    ownerId: number;
  };
}> = ({
  event: {
    name = "Placeholder",
    start_time,
    end_time,
    notes,
    address,
    id,
    ownerId,
  },
}) => {
  console.log("start_time time: ", start_time.getTime());
  return (
    <SafeAreaView>
      <Card>
        <Card.Title>{name}</Card.Title>
        <Text style={styles.sub}>
          When:{" "}
          {start_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {end_time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={styles.sub}>Where: {address}</Text>
        <Text style={styles.sub}>Notes: {notes}</Text>
      </Card>
    </SafeAreaView>

    // <SafeAreaView style={styles.container}>
    //   <View>
    //     <Card.Title>{name}</Card.Title>
    //     <Text style={styles.sub}>{start_time}</Text>
    //     <Text style={styles.sub}>{end_time}</Text>
    //   </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 80,
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

export default Schedule;
