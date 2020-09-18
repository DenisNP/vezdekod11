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
    Div,
    Separator,
    Title,
    Placeholder,
    Checkbox,
    FormLayoutGroup,
    Select,
    SimpleCell, Caption,
} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import {getState, setState, targets} from "../state";
import "./NewPodcast.css";
import {Icon28PodcastOutline} from "@vkontakte/icons";

const osName = platform();

const NewPodcast = ({id, go}) => {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [podcastFile, setPodcastFile] = useState(null);
    const [isExplicit, setIsExplicit] = useState(false);
    const [isExcludedFromExport, setIsExcludedFromExport] = useState(false);
    const [isTrailer, setIsTrailer] = useState(false);
    const [availableTo, setAvailableTo] = useState(0);
    const [fileName, setFileName] = useState("");

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
        setFileName(state.fileName);
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
        reader.onload = () => {
            setFileName(file.name);
            setPodcastFile(file);
        };

        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImage("");
    };

    const openEdit = () => {
        saveState();
        go("edit");
    };

    const goNext = () => {
        if (image && name && desc && podcastFile) {
            saveState();
            go("show");
        }
    };

    const saveState = () => {
        setState({
            image,
            name,
            desc,
            podcastFile,
            isExplicit,
            isExcludedFromExport,
            isTrailer,
            availableTo,
            fileName,
        });
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
                        <div className="remove-btn" onClick={clearImage}>✕</div>
                    </div>
                    : <label>
                        <div className="select-file">
                            <div className="sf-text"><Icon28PictureOutline/></div>
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
            {!podcastFile ?
            <Placeholder className="load-block" action={
                <label>
                    <Button Component="div" mode="outline" onClick={goNext}>Загрузить файл</Button>
                    <input onChange={podcastFileSelected} type="file" accept="audio/*" style={{display: "none"}}/>
                </label>
            }>
                <Title level="2" weight="semibold" style={{color: 'black', marginBottom: 10}}>
                    Загрузите Ваш подкаст
                </Title>
                Выберите готовый аудиофайл из вашего телефона и добавьте его
            </Placeholder>
            : <SimpleCell before={<div className="podcast-icon"><Icon28PodcastOutline style={{opacity: 0.4}}/></div>}>
                    <span style={{marginLeft: 12}}>{fileName}</span>
            </SimpleCell>}
            {podcastFile && <Div>
                <Caption level="2" weight="regular" style={{color: 'var(--text_placeholder)'}}>
                    Вы можете добавить таймкоды и скорректировать подкаст в режиме редактирования
                </Caption>
                <Button
                    size="xl"
                    mode="outline"
                    onClick={openEdit}
                    style={{marginTop: 16}}
                >Редактировать аудиозапись</Button>
            </Div>}
            <Separator/>
            <FormLayout>
                <FormLayoutGroup>
                    <Checkbox checked={isExplicit} onChange={(e) => setIsExplicit(e.currentTarget.checked)}>
                        Ненормативный контент
                    </Checkbox>
                    <Checkbox checked={isExcludedFromExport} onChange={(e) => setIsExcludedFromExport(e.currentTarget.checked)}>
                        Исключить эпизод из экспорта
                    </Checkbox>
                    <Checkbox checked={isTrailer} onChange={(e) => setIsTrailer(e.currentTarget.checked)}>
                        Трейлер подкаста
                    </Checkbox>
                </FormLayoutGroup>
                <Select
                    top="Кому доступен подкаст"
                    onChange={(e) => {
                        setAvailableTo(Number.parseInt(e.currentTarget.value, 10));
                    }}
                    defaultValue={availableTo.toString()}
                >
                    {targets.map((r, i) => <option value={i} key={i}>{r}</option>)}
                </Select>
                <Button
                    size="xl"
                    onClick={goNext}
                    style={{opacity : image && name && desc && podcastFile ? 1.0 : 0.5}}
                >Далее</Button>
            </FormLayout>
        </Panel>
        );
    }

export default NewPodcast;
