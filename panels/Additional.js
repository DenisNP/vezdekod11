import React, {useEffect, useState} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    PanelHeaderButton,
    Panel,
    PanelHeader,
    platform,
    IOS,
    Checkbox,
    FormLayout,
    Select,
    FormLayoutGroup,
    FormStatus, Input, Button
} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import {authors, getState, setState} from "../state";

const osName = platform();

const Additional = ({id, go}) => {
    const [author, setAuthor] = useState(0);
    const [endAmount, setEndAmount] = useState(false);
    const [endDate, setEndDate] = useState(false);
    const [date, setDate] = useState("2021-01-01");

    useEffect(() => {
        const state = getState();
        setAuthor(state.author);
        setEndAmount(state.endAmount);
        setEndDate(state.endDate);
        setDate(state.date);
    }, []);

    const goNext = () => {
        if (endAmount || endDate) {
            setState({
               author,
               endAmount,
               endDate,
               date,
            });
            go("post");
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                Дополнительно
            </PanelHeader>
            <FormLayout>
                <Select
                    top="Автор"
                    onChange={(e) => {
                        setAuthor(Number.parseInt(e.currentTarget.value, 10));
                    }}
                    defaultValue={author.toString()}
                >
                    {authors.map((r, i) => <option value={i} key={i}>{r}</option>)}
                </Select>
                <FormLayoutGroup
                    top="Сбор завершится"
                    bottom={endAmount && endDate ? "Сбор завершится при наступлении обоих событий" : ""}
                >
                    <Checkbox checked={endAmount} onChange={(e) => setEndAmount(e.currentTarget.checked)}>
                        Когда соберём сумму
                    </Checkbox>
                    <Checkbox checked={endDate} onChange={(e) => setEndDate(e.currentTarget.checked)}>
                        Когда наступит заданная дата
                    </Checkbox>
                </FormLayoutGroup>
                {endDate &&
                    <Input
                        type="date"
                        top="Дата"
                        min={new Date().toJSON().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.currentTarget.value)}
                    />
                }
            </FormLayout>
            <Button
                size="xl"
                onClick={goNext}
                style={{opacity: (endAmount || endDate) ? 1.0 : 0.5}}
                className="bottom-btn"
            >
                Создать сбор
            </Button>
        </Panel>
    );
}

export default Additional;
