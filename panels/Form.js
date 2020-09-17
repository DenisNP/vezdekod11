import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import {
    Div,
    FormLayout,
    Input,
    IOS,
    Panel,
    PanelHeader,
    PanelHeaderButton,
    platform,
    Textarea,
    Select,
    Button
} from "@vkontakte/vkui";
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import {authors, getState, receivers, setState} from "../state";
import "./Form.css";

const osName = platform();

const Form = ({id, go}) => {
    const [isRegular, setIsRegular] = useState(false);
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(NaN);
    const [target, setTarget] = useState("");
    const [desc, setDesc] = useState("");
    const [receiver, setReceiver] = useState(0);
    const [author, setAuthor] = useState(0);

    useEffect(() => {
        const state = getState();
        setIsRegular(state.isRegular);
        setImage(state.image);
        setName(state.name);
        setAmount(state.amount);
        setTarget(state.target);
        setDesc(state.desc);
        setReceiver(state.receiver);
        setAuthor(state.author);
    }, []);

    const fileSelected = (e) => {
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

    const clearImage = () => {
        setImage("");
    };

    const writeAmount = (a) => {
        if (Number.isNaN(a) || a < 0.01) {
            setAmount(NaN);
        } else {
            setAmount(Math.floor(a * 100) / 100);
        }
    };

    const goNext = () => {
        if (image && name && desc && amount && target) {
            setState({
               name,
               target,
               amount,
               receiver,
               author,
               image,
               desc,
            });
            isRegular ? go("post") : go("additional");
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader
                left={<PanelHeaderButton onClick={() => window.history.back()}>
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </PanelHeaderButton>}
            >
                {isRegular ? "Регулярный сбор" : "Целевой сбор"}
            </PanelHeader>
            <Div>
                {image
                    ? <div className="bg-image" style={{backgroundImage: `url(${image})`}}>
                        <div className="remove-btn" onClick={clearImage}>✕</div>
                    </div>
                    : <label>
                        <div className="select-file">
                            <div className="sf-text">
                                <Icon28PictureOutline/>
                                <span>Загрузить обложку</span>
                            </div>
                        </div>
                        <input onChange={fileSelected} type="file" accept="image/*" style={{display: "none"}}/>
                    </label>
                }
            </Div>
            <FormLayout>
                <Input
                    top="Название сбора"
                    placeholder="С миру по нитке"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                />
                <Input
                    top={`${isRegular ? "Сумма в месяц" : "Сумма"}, ₽`}
                    placeholder={`Сколько нужно ${isRegular ? "в месяц" : "собрать"}?`}
                    type="number"
                    value={Number.isNaN(amount) ? NaN.toString() : amount}
                    onChange={(e) => writeAmount(e.currentTarget.value)}
                    className={Number.isNaN(amount) ? "" : "amount-input"}
                />
                <Input
                    top="Цель"
                    placeholder="Например, лечение человека"
                    value={target}
                    onChange={(e) => setTarget(e.currentTarget.value)}
                />
                <Textarea
                    top="Описание"
                    placeholder="На что пойдут деньги, и как они кому-то помогут?"
                    value={desc}
                    onChange={(e) => setDesc(e.currentTarget.value)}
                />
                <Select
                    top="Куда получать деньги"
                    onChange={(e) => {
                        setReceiver(Number.parseInt(e.currentTarget.value, 10));
                    }}
                    defaultValue={receiver.toString()}
                >
                    {receivers.map((r, i) => <option value={i} key={i}>{r}</option>)}
                </Select>
                {isRegular &&
                    <Select
                        top="Автор"
                        onChange={(e) => {
                            setAuthor(Number.parseInt(e.currentTarget.value, 10));
                        }}
                        defaultValue={author.toString()}
                    >
                        {authors.map((r, i) => <option value={i} key={i}>{r}</option>)}
                    </Select>
                }
                {
                    <Button
                        size="xl"
                        onClick={goNext}
                        style={{opacity : image && name && desc && amount && target ? 1.0 : 0.5}}
                    >
                        {isRegular ? "Создать сбор" : "Далее"}
                    </Button>
                }
            </FormLayout>
        </Panel>
    );
}

export default Form;
