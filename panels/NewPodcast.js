import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    PanelHeaderButton,
    FormLayout,
    Input,
    Panel,
    PanelHeader,
    platform,
    IOS,
    Textarea,
    Button,
    Div
} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import { getState, setState } from "../state";
import "./NewPodcast.css";

const osName = platform();

const NewPodcast = ({id, go}) => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [podcastFile, setPodcastFile] = useState("");
    const [isExplicit, setIsExplicit] = useState(false);
    const [isExcludedFromExport, setIsExcludedFromExport] = useState(false);
    const [isTrailer, setIsTrailer] = useState(false);
    const [availableTo, setAvailableTo] = useState("");

    useEffect(() => {
        const state = getState();
        setImage(state.image);
        setName(state.name);
        setDesc(state.desc);
        setPodcastFile(state.podcastFile);
        setIsExplicit(state.isExplicit);
        setIsExcludedFromExport(state.isExcludedFromExport);
        setIsTrailer(state.isTrailer);
        setAvailableTo(state.availableTo);
    }, []);

    const imageFileSelected = (e) => {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        const file = files[0];

        const reader = new FileReader();
        reader.onload = (fr) => {
            const dataUri = fr.target.result.toString();
            setImage(dataUri);
        };

        reader.readAsDataURL(file);
    };

    const podcastFileSelected = (e) => {
        const files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        const file = files[0];

        const reader = new FileReader();
        reader.onload = (fr) => {
            const dataUri = fr.target.result.toString();
            setPodcastFile(dataUri);
        };

        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImage("");
    };

    const clearFile = () => {
        setImage("");
    };

    const goNext = () => {
        if (image && name && desc && podcastFile
            && isExplicit && isExcludedFromExport && isTrailer
            && availableTo) {
            setState({
               image,
               name,
               desc,
               podcastFile,
               isExplicit,
               isExcludedFromExport,
               isTrailer,
               availableTo,
            });
            go("show");
        }
    };

    return (
        <Panel id={id} >
             <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                Новый подкаст
            </PanelHeader>
            <Div style={{ display: 'flex'}}>
                {image
                    ? <div className="bg-image" style={{backgroundImage: `url(${image})`}}>
                        <div className="remove-btn" onClick={clearImage}><Icon24Back className="accent-color"/></div>
                    </div>
                    : <label>
                        <div className="select-file">
                            <div className="sf-text">
                                    <Icon28PictureOutline/>
                            </div>
                        </div>
                        <input onChange={imageFileSelected} type="file" accept="image/*" style={{display: "none"}}/>
                    </label>
                }
                <div style={{ width: 'calc(100% - 72px)'}}>
                    <FormLayout className = 'formLayoutName' >
                    <Input
                        top="Название"
                        placeholder="Введите название подкаста"
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                      </FormLayout>

                </div>
            </Div>
            <FormLayout>
            <Textarea
                    top="Описание подкаста"
                    placeholder=""
                    value={desc}
                    onChange={(e) => setDesc(e.currentTarget.value)}
                    />
            </FormLayout>
            <Button onClick={goNext}>Далее</Button>
        </Panel>
        );
    }

export default NewPodcast;
