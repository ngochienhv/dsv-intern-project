import React from "react";
import Headers from "../general/layout/header";
import AppShell from "../general/layout/appShell";
import { Edit, Key, UserCircle } from "tabler-icons-react";
import {
    Avatar,
    Container,
    Grid,
    Group,
    Title,
    Tabs,
    useMantineTheme,
    Text,
    Button,
    Menu,
    ActionIcon,
    Modal,
    Textarea,
    Transition,
    Image,
    Space,
    Skeleton,
} from "@mantine/core";
import {
    useDocumentTitle,
    useShallowEffect,
    useViewportSize,
} from "@mantine/hooks";
import ProfileHome from "../general/profile/profileHome";
import ProfileAbout from "../general/profile/profileAbout";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import ImgDropzone from "../general/others/imgDropzone";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Notifications from "../general/others/notification";
import FollowBtns from "../general/profile/followBtns";
import { baseUrl } from "../general/others/fetchDataFunctions";

type Props = {
    other: boolean;
};

type profile = {
    username: string;
    avatar: string;
    description: string;
    bio: string;
    followers: Object[];
    followersCount: number;
    following: Object[];
    followingCount: number;
    bookmarks: Object[];
    firstname: string;
    lastname: string;
    followed: boolean;
    own: boolean;
};

export default function Profile({ other }: Props) {
    const [edit, setEdit] = React.useState<boolean>(false);
    const [editName, setEditName] = React.useState<boolean>(false);
    const [editAvatar, setEditAvatar] = React.useState<boolean>(false);
    const [editDescript, setEditDescript] = React.useState<boolean>(false);
    const [editBio, setEditBio] = React.useState<boolean>(false);
    const [noti, setNoti] = React.useState<boolean>(false);
    const [notiMessage, setNotiMessage] = React.useState<string>("");
    const [notiStatus, setNotiStatus] = React.useState<string>("");
    const theme = useMantineTheme();
    const [file, setFile] = React.useState<File>();
    const image = React.useRef() as React.MutableRefObject<HTMLImageElement>;
    const [crop, setCrop] = React.useState<Crop>();
    const [output, setOutput] = React.useState<string>();
    const [profile, setProfile] = React.useState<profile>({
        username: "",
        avatar: JSON.parse(localStorage.getItem("user") || "{}").avatar,
        description: "",
        bio: "",
        followers: [],
        followersCount: 0,
        following: [],
        followingCount: 0,
        bookmarks: [],
        firstname: "",
        lastname: "",
        followed: false,
        own: false,
    });
    const [userNotFound, setUserNotFound] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [followed, setFollowed] = React.useState<boolean>(profile.followed);
    const [activeTab, setActiveTab] = React.useState<number>(1);
    const { width } = useViewportSize();
    const { username } = useParams();
    useDocumentTitle(profile.lastname + " " + profile.firstname + " - BBlog");

    const btnStyle = () => ({
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.blue[8]
                : theme.colors.dark[9],
        transition: "background-color 0.3s",
        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.blue[4]
                    : theme.colors.dark[5],
        },
    });

    const cropImage = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.current!.naturalWidth / image.current!.width;
        const scaleY = image.current!.naturalHeight / image.current!.height;
        canvas.width = crop!.width;
        canvas.height = crop!.height;
        const ctx = canvas.getContext("2d");

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop!.width * pixelRatio;
        canvas.height = crop!.height * pixelRatio;
        ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx!.imageSmoothingQuality = "high";

        image &&
            crop &&
            ctx!.drawImage(
                image.current!,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height
            );

        // Converting to base64
        const base64Image = canvas.toDataURL("image/jpeg");

        setOutput(base64Image);
    };

    const getUser = async () => {
        let url = "";
        if (other) {
            url = `${baseUrl}/profiles/${username}`;
        } else {
            url = baseUrl + "/user";
        }

        await axios
            .get(url, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    setProfile(response.data);
                    setFollowed(response.data.followed);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setUserNotFound(true);
                setLoading(false);
            });
    };

    const handleChangeAvatar = async () => {
        const formData = new FormData();
        let img = output?.split(",")[1];
        formData.append("image", img as string);
        await axios
            .post(
                `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGSV_API_KEY}`,
                formData
            )
            .then((response) => {
                let newAva = response.data.data.url;
                axios
                    .post(
                        baseUrl + "/user/change_avatar",
                        {
                            avatar: response.data.data.url,
                        },
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
                            setNoti(true);
                            setNotiMessage(response.data);
                            setNotiStatus("success");
                            let tempProfile = profile;
                            if (tempProfile) {
                                tempProfile.avatar = newAva;
                            }
                            setProfile(tempProfile);
                            const tempUser = JSON.parse(
                                localStorage.getItem("user") || "{}"
                            );
                            tempUser.avatar = newAva;
                            localStorage.setItem(
                                "user",
                                JSON.stringify(tempUser)
                            );
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        setNoti(true);
                        setNotiStatus("fail");
                        setNotiMessage(error.response.data);
                    });
            })
            .catch((error) => console.log(error));
    };

    const handleUpdateProfile = async (values: {
        username: string | undefined;
        firstname: string | undefined;
        lastname: string | undefined;
        description: string | undefined;
        bio: string | undefined;
    }) => {
        await axios
            .put(baseUrl + "/user", values, {
                headers: {
                    "x-access-token": JSON.parse(
                        localStorage.getItem("user") || "{}"
                    ).token,
                },
            })
            .then(async (response) => {
                console.log(response);
                if (response.status === 200) {
                    let tempProfile = profile;
                    if (tempProfile) {
                        tempProfile = {
                            ...tempProfile,
                            username: values.username || "",
                            firstname: values.firstname || "",
                            lastname: values.lastname || "",
                            description: values.description || "",
                            bio: values.bio || "",
                        };
                    }
                    setProfile(tempProfile);
                    setNoti(true);
                    setNotiMessage(response.data);
                    setNotiStatus("success");
                    const tempUser = await JSON.parse(
                        localStorage.getItem("user") || "{}"
                    );
                    tempUser.username = values.username;
                    tempUser.firstname = values.firstname;
                    tempUser.lastname = values.lastname;
                    localStorage.setItem("user", JSON.stringify(tempUser));
                }
            })
            .catch((error) => {
                console.log(error);
                setNoti(true);
                setNotiMessage(error.response.data);
                setNotiStatus("fail");
            });
    };

    const form = useForm({
        initialValues: {
            firstname: profile?.firstname,
            lastname: profile?.lastname,
            username: profile?.username,
            description: profile?.description,
            bio: profile?.bio,
        },

        validate: {
            firstname: (value) =>
                value
                    ? /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/.test(
                          value
                      )
                        ? null
                        : "Invalid first name"
                    : "First name must not be empty",
            lastname: (value) =>
                value
                    ? /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%^&*(){}|~<>;:[\]]{2,}$/.test(
                          value
                      )
                        ? null
                        : "Invalid last name"
                    : "Last name must not be empty",
            username: (value) =>
                value
                    ? /^[^-\s]/.test(value)
                        ? null
                        : "Invalid username"
                    : "Username must not be empty",
        },
    });

    useShallowEffect(() => {
        getUser();
        setActiveTab(0);
    }, [username]);

    return (
        <AppShell
            theme={theme}
            header={<Headers theme={theme} signin={false} />}
            // aside={<Sidebar size={[200, 300, 300]} children={undefined} />}
            aside={undefined}
            // navbar={<NavBar opened={false} />}
            navbar={undefined}
            footer={undefined}
        >
            <Container size="lg" p={width < 768 ? 0 : ""}>
                {!userNotFound ? (
                    <Grid>
                        <Grid.Col>
                            <Group>
                                <Skeleton
                                    visible={loading}
                                    width="auto"
                                    radius={50}
                                >
                                    <Avatar
                                        radius={50}
                                        size="xl"
                                        src={profile.avatar}
                                    />
                                </Skeleton>
                                <Modal
                                    opened={editAvatar}
                                    onClose={() => setEditAvatar(false)}
                                    transition="fade"
                                    transitionDuration={600}
                                    transitionTimingFunction="ease"
                                    title="Change your avatar, select an image and crop it as you like"
                                    size={700}
                                >
                                    {!file ? (
                                        <>
                                            <ImgDropzone setFile={setFile} />
                                            <Space h="md" />
                                        </>
                                    ) : (
                                        <>
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(c) => setCrop(c)}
                                                onComplete={cropImage}
                                                keepSelection={false}
                                            >
                                                {file && (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        imageRef={image}
                                                    />
                                                )}
                                            </ReactCrop>
                                            {output && (
                                                <>
                                                    <Title order={6}>
                                                        Preview
                                                    </Title>
                                                    <Space h="md" />
                                                    <Group>
                                                        <Avatar
                                                            radius={50}
                                                            size="xl"
                                                            src={output}
                                                        />
                                                        <Avatar
                                                            radius={50}
                                                            size="md"
                                                            src={output}
                                                        />
                                                    </Group>
                                                    <Space h="md" />
                                                </>
                                            )}
                                            <Space h="md" />
                                            <Group position="right">
                                                <Button
                                                    sx={btnStyle}
                                                    radius={30}
                                                    onClick={() => {
                                                        setFile(undefined);
                                                        setOutput(undefined);
                                                    }}
                                                >
                                                    Discard
                                                </Button>
                                                <Button
                                                    sx={btnStyle}
                                                    radius={30}
                                                    onClick={() => {
                                                        handleChangeAvatar();
                                                        setFile(undefined);
                                                        setOutput(undefined);
                                                    }}
                                                >
                                                    Confirm
                                                </Button>
                                            </Group>
                                        </>
                                    )}
                                </Modal>

                                <Notifications
                                    noti={noti}
                                    setNoti={setNoti}
                                    notiStatus={notiStatus}
                                    notiMessage={notiMessage}
                                />

                                <Group direction="column" spacing={5}>
                                    <Group>
                                        {!editName ? (
                                            <Group
                                                direction="column"
                                                spacing={5}
                                            >
                                                <Skeleton
                                                    visible={loading}
                                                    width="auto"
                                                >
                                                    <Title order={2}>
                                                        {profile?.lastname +
                                                            " " +
                                                            profile?.firstname}
                                                    </Title>
                                                </Skeleton>
                                                <Skeleton
                                                    visible={loading}
                                                    width="auto"
                                                >
                                                    <Text
                                                        size="sm"
                                                        color="gray"
                                                    >
                                                        {"@" +
                                                            profile?.username}
                                                    </Text>
                                                </Skeleton>
                                            </Group>
                                        ) : (
                                            <Group
                                                direction="column"
                                                spacing={5}
                                            >
                                                <Group>
                                                    <TextInput
                                                        label="First name"
                                                        {...form.getInputProps(
                                                            "lastname"
                                                        )}
                                                    />
                                                    <TextInput
                                                        label="Last name"
                                                        {...form.getInputProps(
                                                            "firstname"
                                                        )}
                                                    />
                                                </Group>
                                                <TextInput
                                                    label="Username"
                                                    {...form.getInputProps(
                                                        "username"
                                                    )}
                                                />
                                            </Group>
                                        )}
                                        <Transition
                                            mounted={edit}
                                            transition="fade"
                                            duration={400}
                                            timingFunction="ease"
                                        >
                                            {(styles) => (
                                                <ActionIcon
                                                    style={styles}
                                                    onClick={() =>
                                                        setEditName(!editName)
                                                    }
                                                >
                                                    <Edit
                                                        size={22}
                                                        strokeWidth={2}
                                                    />
                                                </ActionIcon>
                                            )}
                                        </Transition>
                                        {!profile.own ? (
                                            <FollowBtns
                                                followed={followed}
                                                username={
                                                    username ? username : ""
                                                }
                                                setFollowed={setFollowed}
                                            />
                                        ) : (
                                            <Menu size="md">
                                                <Menu.Item
                                                    icon={
                                                        <Edit
                                                            size={20}
                                                            strokeWidth={2}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        setEdit(true);
                                                        form.setValues({
                                                            firstname:
                                                                profile.firstname,
                                                            lastname:
                                                                profile.lastname,
                                                            username:
                                                                profile.username,
                                                            description:
                                                                profile.description,
                                                            bio: profile.bio,
                                                        });
                                                    }}
                                                >
                                                    Edit profile
                                                </Menu.Item>
                                                <Menu.Item
                                                    icon={
                                                        <UserCircle
                                                            size={20}
                                                            strokeWidth={2}
                                                        />
                                                    }
                                                    onClick={() =>
                                                        setEditAvatar(true)
                                                    }
                                                >
                                                    Change avatar
                                                </Menu.Item>
                                                <Menu.Item
                                                    color="red"
                                                    icon={
                                                        <Key
                                                            size={20}
                                                            strokeWidth={2}
                                                        />
                                                    }
                                                >
                                                    Change password
                                                </Menu.Item>
                                            </Menu>
                                        )}
                                    </Group>
                                </Group>
                            </Group>
                        </Grid.Col>
                        <Grid.Col>
                            <Group grow>
                                {!editDescript ? (
                                    <Skeleton visible={loading} width="auto">
                                        <Text>
                                            {profile?.description
                                                ? profile.description
                                                : profile.own
                                                ? "Describe a little about yourself!"
                                                : ""}
                                        </Text>
                                    </Skeleton>
                                ) : (
                                    <Textarea
                                        label="Description"
                                        autosize={true}
                                        {...form.getInputProps("description")}
                                    />
                                )}
                                <Transition
                                    mounted={edit}
                                    transition="fade"
                                    duration={400}
                                    timingFunction="ease"
                                >
                                    {(styles) => (
                                        <ActionIcon
                                            style={styles}
                                            onClick={() =>
                                                setEditDescript(!editDescript)
                                            }
                                        >
                                            <Edit size={22} strokeWidth={2} />
                                        </ActionIcon>
                                    )}
                                </Transition>
                            </Group>
                            <Group position="right">
                                {edit ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setEdit(false);
                                                setEditAvatar(false);
                                                setEditDescript(false);
                                                setEditName(false);
                                                setEditBio(false);
                                                form.reset();
                                            }}
                                            sx={btnStyle}
                                            radius={30}
                                        >
                                            Discard Changes
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEdit(false);
                                                setEditAvatar(false);
                                                setEditDescript(false);
                                                setEditName(false);
                                                setEditBio(false);
                                                handleUpdateProfile(
                                                    form.values
                                                );
                                            }}
                                            sx={btnStyle}
                                            radius={30}
                                        >
                                            Finish
                                        </Button>
                                    </>
                                ) : null}
                            </Group>
                        </Grid.Col>
                        <Grid.Col p={width < 768 ? 0 : ""}>
                            <Tabs active={activeTab} onTabChange={setActiveTab}>
                                <Tabs.Tab label="Posts" tabKey="First">
                                    <ProfileHome
                                        tab="home"
                                        loading={loading}
                                        setLoading={setLoading}
                                        other={!profile.own}
                                    />
                                </Tabs.Tab>
                                <Tabs.Tab label="Bookmarks" tabKey="Second">
                                    <ProfileHome
                                        tab="bookmarks"
                                        loading={loading}
                                        setLoading={setLoading}
                                        other={!profile.own}
                                    />
                                </Tabs.Tab>
                                <Tabs.Tab label="About" tabKey="Third">
                                    <ProfileAbout
                                        profile={profile}
                                        other={!profile.own}
                                        edit={edit}
                                        form={form}
                                        editBio={editBio}
                                        setEditBio={setEditBio}
                                    />
                                </Tabs.Tab>
                            </Tabs>
                        </Grid.Col>
                    </Grid>
                ) : (
                    <Title order={1}>User not found</Title>
                )}
            </Container>
        </AppShell>
    );
}
