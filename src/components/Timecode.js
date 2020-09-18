import React, {useState, useEffect} from 'react';
import {Input} from "@vkontakte/vkui";
import {Icon24DismissDark} from "@vkontakte/icons";
import "./Timecode.css";
import {getState} from "../state";

const Timecode = ({timecodes, idx, remove}) => {
    const [time, setTime] = useState(0);
    const [text, setText] = useState("");

    useEffect(() => {
        const state = getState();
        const tc = state.timecodes[idx];
        setTime(tc.time);
        setText(tc.text);
    }, []);

    const assignTime = (t) => {
        setTime(t);
        const state = getState();
        const tc = state.timecodes[idx];
        tc.time = t;
    };

    const assignText = (t) => {
        setText(t);
        const state = getState();
        const tc = state.timecodes[idx];
        tc.text = t;
    };

    const getTime = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t - m * 60).toString();
        return `${m.toString().padStart(2, "0")}:${s.padStart(2, "0")}`;
    };

    const getSeconds = (s) => {
        const arr = s.split(":");
        if (arr.length === 0) return 0;
        else if (arr.length === 1) return Number.parseInt(arr[0]);
        else return Number.parseInt(arr[0]) * 60 + Number.parseInt(arr[1]);
    };

    return <div className="timecode">
        <Icon24DismissDark
            onClick={remove}
            style={{marginLeft: 12, marginTop: 10}}
        />
        <Input
            value={text}
            onChange={(e) => assignText(e.currentTarget.value)}
        />
        <Input
            type="time"
            value={getTime(time)}
            onChange={(e) => assignTime(getSeconds(e.currentTarget.value))}
        />
    </div>;
}

export default Timecode;
