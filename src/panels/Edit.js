import React,{useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderButton, IOS, platform, Button, Group, CellButton, Header} from "@vkontakte/vkui";
import {getState, setState} from "../state";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import "./Edit.css";
import {Icon24Add, Icon24ArrowUturnLeftOutline, Icon24Pause, Icon24Play} from "@vkontakte/icons";
import Timecode from "../components/Timecode";

const osName = platform();

const Edit = ({id}) => {
    const [ws, setWs] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [prevBuffer, setPrevBuffer] = useState(null);
    const [fadeLeft, setFadeLeft] = useState(false);
    const [fadeRight, setFadeRight] = useState(false);
    const [cTime, setCTime] = useState(0.0);
    const [timecodes, setTimecodes] = useState([]);

    useEffect(() => {
        const state = getState();
        const wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: '#4986cc',
            progressColor: '#4986cc',
            cursorColor: '#FF3347',
            height: 96,
            barGap: 3,
            barWidth: 2,
            barHeight: 0.65,
            barRadius: 2,
            fillParent: false,
            scrollParent: true,
            plugins: [
                RegionPlugin.create({}),
                TimelinePlugin.create({
                    container: '#timeline',
                    notchPercentHeight: 40,
                    primaryColor: '#99A2AD',
                    secondaryColor: '#99A2AD',
                    primaryFontColor: '#99A2AD',
                    secondaryFontColor: '#99A2AD',
                    height: 14,
                }),
            ],
        });

        setWs(wavesurfer);
        setTimecodes(state.timecodes);

        wavesurfer.on('seek', (r) => {
            const d = wavesurfer.getDuration();
            const rd = r * d;
            const rVal = Object.values(wavesurfer.regions.list);
            if (rVal.length > 0 && (rd > rVal[0].end || rd < rVal[0].start)) {
                wavesurfer.clearRegions();
            } else if (rVal.length === 0) {
                const fr = Math.max(0, rd - 5);
                const sr = Math.min(rd + 5, d);
                wavesurfer.clearRegions();
                wavesurfer.addRegion({
                    start: fr,
                    end: sr
                });
            }
        });
        wavesurfer.on('ready', () => {
            setState({duration: wavesurfer.getDuration()});
        });
        wavesurfer.on('play', () => {
            setIsPlaying(true);
        });
        wavesurfer.on('pause', () => {
            setIsPlaying(false);
        });
        wavesurfer.loadBlob(state.podcastFile);
        wavesurfer.on('audioprocess', (e) => {
            setCTime(e);
        });
    }, []);

    useEffect(() => {
        if (!ws) return;
        const d = ws.getDuration();
        if (fadeLeft && cTime < 3) {
            ws.setVolume(cTime / 3);
        } else if (fadeRight && cTime > d - 3) {
            ws.setVolume((d - cTime) / 3);
        } else {
            ws.setVolume(1);
        }
    }, [cTime]);

    const cut = () => {
        const rVal = Object.values(ws.regions.list);
        if(rVal.length > 0) {
            const original_buffer = ws.backend.buffer;
            const newLength = ws.getDuration() - (rVal[0].end - rVal[0].start);
            const new_buffer = ws.backend.ac.createBuffer(original_buffer.numberOfChannels, newLength * original_buffer.sampleRate, original_buffer.sampleRate);

            setPrevBuffer(original_buffer);

            const first_list_index        = (rVal[0].start * original_buffer.sampleRate);
            const second_list_index       = (rVal[0].end * original_buffer.sampleRate);

            const first_list_l        = original_buffer.getChannelData(0).slice(0, first_list_index);
            const second_list_l     = original_buffer.getChannelData(0).slice(second_list_index, original_buffer.length);
            const first_list_r        = original_buffer.getChannelData(1).slice(0, first_list_index);
            const second_list_r     = original_buffer.getChannelData(1).slice(second_list_index, original_buffer.length);
            const new_data_l = new_buffer.getChannelData(0);
            const new_data_r = new_buffer.getChannelData(1);

            for (let i = 0; i < first_list_l.length; i++) {
                new_data_l[i] = first_list_l[i];
                new_data_r[i] = first_list_r[i];
            }
            for (let k = 0; k < second_list_l.length; k++) {
                new_data_l[k + first_list_l.length] = second_list_l[k];
                new_data_r[k + first_list_r.length] = second_list_r[k];
            }

            ws.loadDecodedBuffer(new_buffer);
            setTimeout(() => {
                setState({duration: ws.getDuration()});
            }, 2000);
        }
    };

    const undo = () => {
        if (!prevBuffer) return;
        try {
            ws.pause();
            ws.loadDecodedBuffer(prevBuffer);
            setPrevBuffer(null);
        } catch (e) {}
    };

    const playPause = () => {
        try {
            ws.playPause();
        } catch (e){}
    };

    const fLeft = () => {
        setFadeLeft(!fadeLeft);
    };

    const fRight = () => {
        setFadeRight(!fadeRight);
    };

    const addTimecode = () => {
        const state = getState();
        state.timecodes.push({
            text: `Таймкод #${state.timecodes.length - (-1)}`,
            time: ws.getCurrentTime()
        });
        setTimecodes([...state.timecodes]);
    };

    const removeTimecode = (idx) => {
        const state = getState();
        state.timecodes.splice(idx, 1);
        setTimecodes([...state.timecodes]);
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                Редактирование
            </PanelHeader>
            <div className="wf-container">
                <div id="timeline"/>
                <div id="waveform"/>
            </div>
            <div className="btns-container">
                <Button onClick={playPause} className="square-btn" before={
                    isPlaying
                        ? <Icon24Pause style={{marginLeft: 12}}/>
                        : <Icon24Play style={{marginLeft: 10}}/>
                }/>
                <div style={{display: 'flex'}}>
                    <Button onClick={() => {cut()}} className="square-btn" before={<div className="scissors"/>} mode="secondary"/>
                    <Button
                        onClick={() => {undo()}}
                        className="square-btn"
                        before={<Icon24ArrowUturnLeftOutline style={{marginLeft: 10}}/>}
                        style={{marginLeft: 4, opacity: prevBuffer ? 1.0 : 0.5}}
                        mode="secondary"
                    />
                </div>
                <div style={{display: 'flex'}}>
                    <Button
                        className="square-btn"
                        before={<div className={`bc-${fadeLeft ? 'white' : 'blue'}-left`}/>}
                        style={{marginRight: 4}}
                        mode={fadeLeft ? 'primary' : 'secondary'}
                        onClick={fLeft}
                    />
                    <Button
                        className="square-btn"
                        before={<div className={`bc-${fadeRight ? 'white' : 'blue'}-right`}/>}
                        mode={fadeRight ? 'primary' : 'secondary'}
                        onClick={fRight}
                    />
                </div>
            </div>
            <Group header={<Header mode="secondary">Таймкоды</Header>}>
                {timecodes.map((tc, i) => <Timecode idx={i} key={i} remove={() => removeTimecode(i)}/>)}
                <CellButton before={<Icon24Add/>} onClick={addTimecode}>Добавить таймкод</CellButton>
            </Group>
        </Panel>
    );
}

export default Edit;
