import {useContext, useEffect, useState} from "react";
import Button from "../button/Button";
import TweetInput from "../tweet-input/TweetInput";
import {useHttpRequestService} from "../../service/HttpRequestService";
import {setLength, updateFeed} from "../../redux/user";
import ImageContainer from "../tweet/tweet-image/ImageContainer";
import {BackArrowIcon} from "../icon/Icon";
import ImageInput from "../common/ImageInput";
import {useTranslation} from "react-i18next";
import {ButtonType} from "../button/StyledButton";
import {StyledTweetBoxContainer} from "./TweetBoxContainer";
import {StyledContainer} from "../common/Container";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { User } from "../../service";
import { StyledButtonContainer } from "./ButtonContainer";
import useReactQueryProxy from "../../service/reactQueryRequestProxy";
import ToastContext from "../toast/ToastContext";
import { ToastType } from "../toast/Toast";

interface TweetBoxProps {
    parentId?: string
    mobile?: boolean
    close?: ()=>void
}


const TweetBox = ({ parentId, mobile = false, close} : TweetBoxProps) => {
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);
    const {createToast} = useContext(ToastContext)

    const {length, query} : {length : number, query : string} = useAppSelector((state) => state.user);
    const httpService = useHttpRequestService();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const service = useReactQueryProxy()

    //TODO: manage error and loading
    const {data: user, isLoading, error} = service.useMe()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };
    const handleSubmit = async () => {
        try {
            httpService.createPost({content: content, parentId: parentId, images: images})
                .then(()=>createToast(t("toast.created-post"), ToastType.INFO))
            setContent("");
            setImages([]);
            setImagesPreview([]);
            dispatch(setLength(length + 1));
            //TODO: check why this: const posts = await httpService.getPosts(length + 1, "", query);
            const posts = await httpService.getPosts(query);
            dispatch(updateFeed(posts));
            close && close();
        } catch (e) {
            console.log(e);
        }
    };

    const handleRemoveImage = (index : number) => {
        const newImages = images.filter((i, idx) => idx !== index);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImages(newImages);
        setImagesPreview(newImagesPreview);
    };

    const handleAddImage = (newImages: File[]) => {
        setImages(newImages);
        const newImagesPreview = newImages.map((i) => URL.createObjectURL(i));
        setImagesPreview(newImagesPreview);
    };

    return (
        <StyledTweetBoxContainer>
            {mobile && (
                <StyledContainer
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <BackArrowIcon onClick={close}/>
                    <Button
                        text={"Tweet"}
                        buttonType={ButtonType.DEFAULT}
                        size={"SMALL"}
                        onClick={handleSubmit}
                        disabled={content.length === 0}
                    />
                </StyledContainer>
            )}
            <StyledContainer style={{width: "100%"}}>
                <TweetInput
                    onChange={handleChange}
                    maxLength={240}
                    placeholder={t("placeholder.tweet")}
                    value={content}
                    src={user?.profilePicture}
                />
                <StyledContainer padding={"0 0 0 10%"}>
                    <ImageContainer
                        editable
                        images={imagesPreview}
                        removeFunction={handleRemoveImage}
                    />
                </StyledContainer>
                <StyledButtonContainer>
                    <ImageInput setImages={handleAddImage} parentId={parentId}/>
                    {!mobile && (
                        <Button
                            text={"Tweet"}
                            buttonType={ButtonType.DEFAULT}
                            size={"SMALL"}
                            onClick={handleSubmit}
                            disabled={
                                content.length <= 0 ||
                                content.length > 240 ||
                                images.length > 4 ||
                                images.length < 0
                            }
                        />
                    )}
                </StyledButtonContainer>
            </StyledContainer>
        </StyledTweetBoxContainer>
    );
};

export default TweetBox;
