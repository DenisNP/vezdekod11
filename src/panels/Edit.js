import React,{useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {Panel, PanelHeader, PanelHeaderButton, IOS, platform, Button} from "@vkontakte/vkui";
import {getState} from "../state";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import WaveSurfer from 'wavesurfer.js';
import RegionPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import "./Edit.css";
import {Icon24Pause, Icon24Play} from "@vkontakte/icons";

const osName = platform();

const Edit = ({id}) => {
    const [ws, setWs] = useState(null);
    const [nd, setNd] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [prevBuffer, setPrevBuffer] = useState(null);

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
            const context = wavesurfer.backend.getAudioContext();
            const source = context.createBufferSource();
            const gainNode = context.createGain();
            source.connect(gainNode);
            gainNode.connect(context.destination);
            setNd(gainNode);
        });
        wavesurfer.on('play', () => {
            setIsPlaying(true);
        });
        wavesurfer.on('pause', () => {
            setIsPlaying(false);
        });
        wavesurfer.loadBlob(state.podcastFile);
    }, []);

    const cut = () => {
        const rVal = Object.values(ws.regions.list);
        if(rVal.length > 0){
            const original_buffer = ws.backend.buffer;
            const new_buffer      = ws.backend.ac.createBuffer(original_buffer.numberOfChannels, original_buffer.length, original_buffer.sampleRate);

            setPrevBuffer(original_buffer);

            const first_list_index        = (rVal[0].start * original_buffer.sampleRate);
            const second_list_index       = (rVal[0].end * original_buffer.sampleRate);
            const second_list_mem_alloc   = (original_buffer.length - (rVal[0].end * original_buffer.sampleRate));

            const new_list        = new Float32Array( parseInt( first_list_index ));
            const second_list     = new Float32Array( parseInt( second_list_mem_alloc ));
            const combined        = new Float32Array( original_buffer.length );

            original_buffer.copyFromChannel(new_list, 0);
            original_buffer.copyFromChannel(second_list, 0, second_list_index)

            combined.set(new_list)
            combined.set(second_list, first_list_index)

            new_buffer.copyToChannel(combined, 0);

            ws.loadDecodedBuffer(new_buffer);
        }
    };

    const undo = () => {
        if (!prevBuffer) return;
        ws.loadDecodedBuffer(prevBuffer);
        setPrevBuffer(null);
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
                <Button onClick={() => {ws.playPause()}} className="square-btn" before={
                    isPlaying
                        ? <Icon24Pause style={{marginLeft: 10}}/>
                        : <Icon24Play style={{marginLeft: 10}}/>
                }/>
            </div>
        </Panel>
    );
}

export default Edit;
