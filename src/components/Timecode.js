import React from 'react';
import {Input} from "@vkontakte/vkui";
import {Icon24DismissDark} from "@vkontakte/icons";
import "./Timecode.css";

const Timecode = ({timecode, remove}) => {
    const getTime = (t) => {
        const m = Math.floor(t / 60).toString();
        const s = Math.floor(t - m * 60).toString();
        return `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
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
            value={timecode.text}
            onChange={(e) => {timecode.text = e.currentTarget.value}}
        />
        <Input
            type="time"
            value={getTime(timecode.time)}
            onChange={(e) => {timecode.time = getSeconds(e.currentTarget.value)}}
        />
    </div>;
}

export default Timecode;
