import React, { Dispatch, SetStateAction } from "react";
import { Article } from "../../user/editor";
import axios from "axios";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";

interface EditArticle {
    _id: string;
    author: string;
    content: string;
    description: string | null;
    favoritesCount: number;
    image: string | null;
    lastUpdated: string;
    published: boolean;
    slug: string | null;
    tags: string[] | null;
    title: string | null;
}

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const handleCreateArticle = async (
    setArticleId: Dispatch<SetStateAction<string>>
) => {
    await axios
        .post(
            baseUrl + "/articles",
            {},
            {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            }
        )
        .then((response) => {
            console.log(response);
            setArticleId(() => response.data.article);
        })
        .catch((err) => {
            console.log(err);
        });
};

export const getUserArticles = async (
    typ: string,
    author: string,
    setArticles: Dispatch<SetStateAction<Article[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    pageOffset: number,
    setHasMore: Dispatch<SetStateAction<boolean>>
) => {
    if (typ === "published") {
        await axios
            .get(
                `${baseUrl}/articles/published/${pageOffset}?author=${author}`,
                {
                    headers: {
                        "x-access-token": JSON.parse(
                            localStorage.getItem("user") || "{}"
                        ).token,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setArticles((articles) => articles.concat(res.data));
                if (res.data.length < 3) {
                    setHasMore(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    } else {
        await axios
            .get(`${baseUrl}/articles/unpublished`, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((res) => {
                console.log(res);
                setArticles(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }
};

export const getOthersArticles = async (
    username: string,
    setArticles: Dispatch<SetStateAction<Article[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>
) => {
    await axios
        .get(`${baseUrl}/articles/${username}`)
        .then((res) => {
            console.log(res);
            setArticles(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
};

export const getEditArticle = async (
    article_id: string,
    form: UseForm<EditArticle>,
    setLoading: Dispatch<SetStateAction<boolean>>
) => {
    await axios
        .get(`${baseUrl}/articles?articleId=${article_id}`, {
            headers: {
                "x-access-token": JSON.parse(
                    localStorage.getItem("user") || "{}"
                ).token,
            },
        })
        .then((response) => {
            console.log(response.data);
            form.setValues(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
};

export const handleUpdateArticle = async (
    form: UseForm<EditArticle>,
    openPreview: boolean,
    setNoti: Dispatch<SetStateAction<boolean>>,
    setNotiMessage: Dispatch<SetStateAction<string>>,
    setNotiStatus: Dispatch<SetStateAction<string>>
) => {
    await axios
        .put(baseUrl + "/articles", form.values, {
            headers: {
                "x-access-token": JSON.parse(
                    localStorage.getItem("user") || "{}"
                ).token,
            },
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                if (!openPreview) {
                    setNoti(true);
                    setNotiMessage("Saved successfully!");
                    setNotiStatus("success");
                }
            }
        })
        .catch((error) => {
            console.log(error);
            if (!openPreview) {
                setNoti(true);
                setNotiMessage("Fail to save!");
                setNotiStatus("fail");
            }
        });
};

export const handleDeleteArticle = async (
    id: string,
    setNoti: Dispatch<SetStateAction<boolean>>,
    setNotiMessage: Dispatch<SetStateAction<string>>,
    setNotiStatus: Dispatch<SetStateAction<string>>,
    setArticles: Dispatch<SetStateAction<Article[]>>
) => {
    await axios
        .delete(`${baseUrl}/articles?articleId=${id}`, {
            headers: {
                "x-access-token": JSON.parse(
                    localStorage.getItem("user") || "{}"
                ).token,
            },
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                setNoti(true);
                setNotiMessage("Delete article successfully!");
                setNotiStatus("success");
                setArticles((articles) =>
                    articles.filter((article) => article._id !== id)
                );
            }
        })
        .catch((error) => {
            console.log(error);
            setNoti(true);
            setNotiStatus("fail");
            setNotiMessage("Delete article failed!");
        });
};
