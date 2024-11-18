import { useDataContext } from "@/data-store/dataContext";
import { useState } from "react";
import { Text, View } from "react-native";

export default function CourseScreen() {
    const [selected, setSelected] = useState('');
    return(
        <View>
            <Text>Dogs</Text>
        </View>
    );
}