import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {PanelHeaderButton, Panel, PanelHeader, platform, IOS, Div, Button} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import {authors, getState, setState} from "../state";
import Snippet from "../components/Snippet";
import "./Post.css";

const osName = platform();

const Post = ({id, go}) => {
    const [authorName, setAuthorName] = useState("");
    const [data, setData] = useState({});
    const [wallText, setWallText] = useState("");

    useEffect(() => {
        const state = getState();
        setAuthorName(authors[state.author].split(" ")[0]);
        setWallText(state.wallText || state.target);
    }, []);

    useEffect(() => {
        setData(getState());

        const ta = document.getElementById("ta");
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    });

    const goNext = () => {
        setState({wallText});
        go("wall");
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                {authorName}
            </PanelHeader>
            <Div>
                <textarea
                    id="ta"
                    value={wallText}
                    onChange={(e) => setWallText(e.currentTarget.value)}
                    className="wall-post-text"
                />
            </Div>
            <Snippet data={data}/>
            <Button
                size="xl"
                onClick={goNext}
                className="bottom-btn"
            >
                Опубликовать
            </Button>
        </Panel>
    );
}

export default Post;
