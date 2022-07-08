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

export const handleCreateArticle = async (
    setArticleId: Dispatch<SetStateAction<string>>
) => {
    await axios
        .post(
            "http://localhost:5000/api/articles",
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
    console.log(pageOffset);

    if (typ === "published") {
        await axios
            .get(
                `http://localhost:5000/api/articles/published/${pageOffset}?author=${author}`,
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
            .get(`http://localhost:5000/api/articles/unpublished`, {
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
        .get(`http://localhost:5000/api/articles/${username}`)
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
        .get(`http://localhost:5000/api/articles?articleId=${article_id}`, {
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
        .put("http://localhost:5000/api/articles", form.values, {
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
        .delete(`http://localhost:5000/api/articles?articleId=${id}`, {
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

export const handleFollowUser = async (
    username: string,
    setFollowed: Dispatch<SetStateAction<boolean>>
) => {
    await axios
        .post(
            `http://localhost:5000/api/profiles/${username}/follow`,
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
            if (response.status === 200) {
                setFollowed(true);
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

export const handleUnFollowUser = async (
    username: string,
    setFollowed: Dispatch<SetStateAction<boolean>>
) => {
    await axios
        .delete(`http://localhost:5000/api/profiles/${username}/follow`, {
            headers: {
                "x-access-token": JSON.parse(
                    localStorage.getItem("user") || "{}"
                ).token,
            },
        })
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                setFollowed(false);
            }
        })
        .catch((error) => {
            console.log(error);
        });
};
