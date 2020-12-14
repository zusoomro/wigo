import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, TextInput, View, Text } from "react-native";
import Button from "../shared/Button";
import DropDownPicker from "react-native-dropdown-picker";
import LocationPicker from "./LocationPicker";
import DatePicker from "./DatePicker";
import sharedStyles from "../sharedStyles";
import Event from "../types/Event";
import {
  validateEventSchema,
  createEventOnSubmit,
  modifyEventOnSubmit,
  proposeEvent,
  ProposedEventConflicts,
} from "./eventsService";
import { ConflictAction, eventConflictAlert } from "./eventConflicts";
import { useSelector } from "react-redux";
import { RootState } from "../configureStore";

export const repetitionValues = [
  { label: "Does not repeat", value: "no_repeat" },
  { label: "Every day", value: "daily" },
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Every year", value: "yearly" },
];

type Props = {
  event?: Event;
  navigation: {
    navigate: (screen: string) => void;
  };
  route: Object;
};

const CreateModifyEvent: React.FC<Props> = ({ navigation, route }) => {
  const event = route?.params?.event;
  const podId = useSelector((state: RootState) => state.pods.pods[0].id);

  // Start time = current time
  const start_time = useState(new Date());
  // End time = current time + 1 hour
  const end_time = useState(new Date(Date.now() + 60 * 60 * 1000));

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={
          event
            ? {
                name: event.name,
                formattedAddress: event.formattedAddress,
                lat: event.lat,
                lng: event.lng,
                start_time: event.start_time,
                end_time: event.end_time,
                repeat: repetitionValues[0].value,
                notes: event.notes,
              }
            : {
                name: "",
                formattedAddress: "",
                lat: "",
                lng: "",
                start_time: start_time,
                end_time: end_time,
                repeat: repetitionValues[0].value,
                notes: "",
              }
        }
        validationSchema={validateEventSchema}
        onSubmit={(values) => {
          handleEventSubmission(values as Event, event, navigation, podId);
        }}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          setFieldValue,
          touched,
          values,
        }) => (
          <View style={{ margin: 15 }}>
            <Text style={sharedStyles.inputLabelText}>Event Name</Text>
            <TextInput
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              placeholder="event name"
              style={[sharedStyles.input, { marginBottom: 0 }]}
            />
            <Text style={sharedStyles.inputError}>
              {touched.name && errors.name ? (errors.name as String) : ""}
            </Text>
            <Text style={sharedStyles.inputLabelText}>Location</Text>
            <LocationPicker
              latFieldName="lat"
              lngFieldName="lng"
              formattedAddressFieldName="formattedAddress"
              formattedAddress={values.formattedAddress}
            />
            <Text style={sharedStyles.inputError}>
              {touched.formattedAddress && errors.formattedAddress
                ? (errors.formattedAddress as String)
                : ""}
            </Text>
            {/* Start Time input */}
            <Text style={sharedStyles.inputLabelText}>Start Time</Text>
            <DatePicker name="start_time" date={start_time} />
            {touched.start_time && errors.start_time && (
              <Text>{errors.start_time}</Text>
            )}
            <Text style={sharedStyles.inputLabelText}>End Time</Text>
            {/* End Time input */}
            <DatePicker name="end_time" date={end_time} />
            {errors.end_time && (
              <Text style={sharedStyles.inputError}>{errors.end_time}</Text>
            )}
            {/* Pick repetition value*/}
            <Text style={sharedStyles.inputLabelText}>Repeat</Text>
            <DropDownPicker
              items={repetitionValues}
              defaultValue={values.repeat}
              onChangeItem={(item) => setFieldValue("repeat", item.value)}
              itemStyle={{ justifyContent: "flex-start" }}
              containerStyle={{ borderRadius: 15 }}
              style={[
                sharedStyles.input,
                {
                  borderRadius: 15,
                  borderWidth: 0,
                  paddingLeft: 15,
                },
              ]}
              labelStyle={sharedStyles.inputText}
            />
            <Text style={sharedStyles.inputLabelText}>Description</Text>
            <TextInput
              onChangeText={handleChange("notes")}
              onBlur={handleBlur("notes")}
              value={values.notes}
              placeholder="Add description"
              style={[sharedStyles.input, { marginBottom: 24 }]}
            />
            <Button
              onPress={handleSubmit}
              title="Save"
              style={[{ margin: 0 }, !isValid && sharedStyles.disabledButton]}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const handleEventSubmission = async (
  values: Event,
  existingEvent: Event,
  navigation,
  podId: number
) => {
  let action: ConflictAction = ConflictAction.scheduleEvent;
  // Check if event conflicts, and set action to the value chosen by the user
  const conflicts: ProposedEventConflicts = (await proposeEvent(
    values as Event,
    podId
  ))!;

  if (conflicts.isConflicting) {
    await eventConflictAlert().then((userChosenAction: ConflictAction) => {
      action = userChosenAction;
    });
  }

  // User wants to continue editing the event
  if ((action as ConflictAction) === ConflictAction.editEvent) {
    return;
  }
  // User wants to schedule event at suggested time
  if ((action as ConflictAction) == ConflictAction.suggestedTime) {
    // TO DO: SET VALUES TO SUGGESTED TIME
  }

  if (existingEvent) {
    modifyEventOnSubmit({ ...values, id: existingEvent.id } as Event);
  } else {
    createEventOnSubmit(values as Event);
  }
  navigation.navigate("ScheduleHomePage");
};

export default CreateModifyEvent;
