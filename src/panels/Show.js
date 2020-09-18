import React,{useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    IOS,
    Panel,
    PanelHeader,
    PanelHeaderButton,
    platform,
    RichCell,
    Avatar,
    Separator,
    Div,
    Group, Link, Title
} from "@vkontakte/vkui";
import Icon28ChevronBack from "@vkontakte/icons/dist/28/chevron_back";
import Icon24Back from "@vkontakte/icons/dist/24/back";
import {getState} from "../state";

const osName = platform();

const Show = ({id, go}) => {

    const [state, setState] = useState(getState());

    const goNext = () => {
        go("finish");
    };
    const getDuration = () => {
        const h = Math.floor(state.duration / 3600);
        const m = Math.floor((state.duration - h * 3600) / 60);
        const s = Math.floor(state.duration - h * 3600 - m * 60);
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };
    const shortDuration = (t) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t - m * 60);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (

        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                Новый подкаст
            </PanelHeader>
            <RichCell
                before={<Avatar mode="app" size={48} src={state.image} />}
                text="Васиий Иванов"
                caption={`Длительность: ${getDuration()}`}
            >
                {state.name}
            </RichCell>
            <Separator/>
            <Div>
                <Group header={<Title style={{marginTop: 0}} level="3" weight="semibold">Описание</Title>}>
                    {state.desc}
                </Group>
            </Div>
            <Separator/>
            <Div>
                <Group header={<Title style={{marginTop: 0, marginBottom: 8}} level="3" weight="semibold">Содержание</Title>}>
                    {state.timecodes.map((tc) => <div style={{marginBottom: 8}}>
                        <Link>{shortDuration(tc.time)}</Link> — {tc.text}
                    </div>)}
                </Group>
            </Div>
        </Panel>
    );
}

export default Show;
