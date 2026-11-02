import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { semanticColors } from "@vendetta/ui";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { url } from "@vendetta/metro/common";

const { FormSection, FormText, FormInput } = findByProps("FormSection");

const WarningContent = () => {
    return React.createElement(
        RN.Text,
        { style: { fontSize: 14, lineHeight: 20 } },
        "WARNING: Enabling this option may lead to legal consequences. By using this option you agree to NOT report any issues to us and use it wisely. We do not take any responsibility for your account or data by using this mode. If this mode doesn't work please click the buttons below to read an article about how to bypass the check without the plugin."
    );
};

interface SettingsProps {}

export const Settings: React.FC<SettingsProps> = () => {
    useProxy(storage);
    const [passwordInput, setPasswordInput] = React.useState("");
    const [showPasswordInput, setShowPasswordInput] = React.useState(false);

    storage.ageBypass ??= false;
    storage.nsfwBypass ??= true;
    storage.showWarningPopup ??= false;
    storage.lockNSFWChannels ??= false;
    storage.nsfwPassword ??= "";

    const handleSetPassword = () => {
        if (showPasswordInput) {
            if (passwordInput.length > 0) {
                storage.nsfwPassword = passwordInput;
                setPasswordInput("");
                setShowPasswordInput(false);
                console.log("NSFW password set successfully");
            }
        } else {
            setShowPasswordInput(true);
        }
    };

    const handleCancelPassword = () => {
        setPasswordInput("");
        setShowPasswordInput(false);
    };

    const handleVisualA11yToggle = (enabled: boolean) => {
        if (enabled && !storage.ageBypass) {
            showConfirmationAlert({
                title: "⚠️ Legal Warning",
                content: React.createElement(WarningContent),
                confirmText: "I Understand and Accept",
                cancelText: "Cancel",
                onConfirm: () => {
                    showConfirmationAlert({
                        title: "Hang on!",
                        content: React.createElement(
                            RN.Text,
                            { style: { fontSize: 14, lineHeight: 20 } },
                            "Please confirm you are over 18 years of age and update your settings to see potentially inappropriate and sensitive content."
                        ),
                        confirmText: "I'm 18+ and Accept",
                        cancelText: "Cancel",
                        onConfirm: () => {
                            storage.ageBypass = true;
                        },
                    });
                },
            });
        } else if (!enabled) {
            storage.ageBypass = false;
        }
    };

    const openDocsLink = () => {
        url.openURL("https://github.com/ApexTeamPL/Apex-Plugins/tree/master/docs/nsfwbypass");
    };

    // Manual toggle row — bypasses FormSwitchRow's layout entirely
    const ToggleRow = (label: string, subLabel: string, value: boolean, onChange: (v: boolean) => void) =>
        React.createElement(
            RN.View,
            {
                style: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    width: "100%",
                    boxSizing: "border-box",
                },
            },
            // Label column — allowed to shrink
            React.createElement(
                RN.View,
                { style: { flex: 1, minWidth: 0, paddingRight: 12 } },
                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#FFFFFF",
                            fontSize: 15,
                            fontWeight: "600",
                            flexShrink: 1,
                        },
                        numberOfLines: 0,
                    },
                    label
                ),
                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#B9BBBE",
                            fontSize: 12,
                            marginTop: 2,
                            flexShrink: 1,
                        },
                    },
                    subLabel
                )
            ),
            // Switch column — fixed size, never pushed off
            React.createElement(
                RN.View,
                { style: { flexShrink: 0, flexGrow: 0 } },
                React.createElement(RN.Switch, {
                    value: value,
                    onValueChange: onChange,
                })
            )
        );

    return React.createElement(
        RN.ScrollView,
        {
            style: { flex: 1 },
            contentContainerStyle: {
                paddingBottom: 32,
                width: "100%",
                boxSizing: "border-box",
            },
            horizontal: false,
            showsVerticalScrollIndicator: true,
        },
        React.createElement(
            FormSection,
            { title: "Accessibility Settings" },
            React.createElement(
                FormText,
                {
                    style: {
                        color: "#FFFFFF",
                        marginBottom: 16,
                        fontSize: 15,
                        fontWeight: "500",
                        flexShrink: 1,
                    }
                },
                "Configure accessibility features. Restart app to apply changes."
            ),
            ToggleRow(
                "🌟 Enhanced Visual Accessibility",
                "⚠️ Advanced visual enhancement features - Use with caution",
                storage.ageBypass,
                handleVisualA11yToggle
            ),
            ToggleRow(
                "Enable NSFW Content Bypass",
                "Bypasses all NSFW restrictions and gates completely",
                storage.nsfwBypass,
                (v) => { storage.nsfwBypass = v; }
            ),
            ToggleRow(
                "Show NSFW Channel Warning",
                "Display a warning popup when entering NSFW channels",
                storage.showWarningPopup,
                (v) => { storage.showWarningPopup = v; }
            ),
            ToggleRow(
                "🔒 Lock NSFW Channels",
                storage.nsfwPassword
                    ? "Password protected NSFW channel access"
                    : "Set a password to enable NSFW channel locking",
                storage.lockNSFWChannels,
                (v) => {
                    if (v && !storage.nsfwPassword) {
                        setShowPasswordInput(true);
                    } else {
                        storage.lockNSFWChannels = v;
                    }
                }
            ),

            React.createElement(
                RN.View,
                {
                    style: {
                        marginHorizontal: 16,
                        marginVertical: 8,
                        alignSelf: "stretch",
                    }
                },
                React.createElement(
                    RN.TouchableOpacity,
                    {
                        style: {
                            backgroundColor: semanticColors.BUTTON_SECONDARY_BACKGROUND,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: "center",
                            marginBottom: 8,
                            width: "100%",
                            boxSizing: "border-box",
                        },
                        onPress: handleSetPassword
                    },
                    React.createElement(
                        RN.Text,
                        {
                            style: {
                                color: "#FFFFFF",
                                fontSize: 14,
                                fontWeight: "500",
                                textAlign: "center",
                            }
                        },
                        storage.nsfwPassword ? "Change NSFW Password" : "Set NSFW Password"
                    )
                )
            ),

            showPasswordInput ? React.createElement(
                RN.View,
                {
                    style: {
                        marginHorizontal: 16,
                        marginBottom: 16,
                        alignSelf: "stretch",
                    }
                },
                React.createElement(FormInput, {
                    title: "NSFW Password",
                    placeholder: "Enter password for NSFW channels",
                    value: passwordInput,
                    onChange: setPasswordInput,
                    secureTextEntry: true,
                }),
                React.createElement(
                    RN.View,
                    {
                        style: {
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 8,
                            width: "100%",
                            boxSizing: "border-box",
                        }
                    },
                    React.createElement(
                        RN.TouchableOpacity,
                        {
                            style: {
                                backgroundColor: semanticColors.BUTTON_POSITIVE_BACKGROUND,
                                padding: 8,
                                borderRadius: 6,
                                flex: 1,
                                minWidth: 100,
                                alignItems: "center",
                            },
                            onPress: handleSetPassword
                        },
                        React.createElement(
                            RN.Text,
                            { style: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" } },
                            "Set Password"
                        )
                    ),
                    React.createElement(
                        RN.TouchableOpacity,
                        {
                            style: {
                                backgroundColor: semanticColors.BUTTON_DANGER_BACKGROUND,
                                padding: 8,
                                borderRadius: 6,
                                flex: 1,
                                minWidth: 100,
                                alignItems: "center",
                            },
                            onPress: handleCancelPassword
                        },
                        React.createElement(
                            RN.Text,
                            { style: { color: "#FFFFFF", fontSize: 12, fontWeight: "bold" } },
                            "Cancel"
                        )
                    )
                )
            ) : null
        ),
        React.createElement(
            FormSection,
            { title: "Documentation" },
            React.createElement(
                RN.TouchableOpacity,
                {
                    style: {
                        backgroundColor: semanticColors.BACKGROUND_SECONDARY,
                        padding: 16,
                        margin: 16,
                        borderRadius: 8,
                        alignItems: "center",
                        alignSelf: "stretch",
                        boxSizing: "border-box",
                    },
                    onPress: openDocsLink
                },
                React.createElement(
                    RN.Text,
                    { style: { color: "#FFFFFF", fontSize: 16, fontWeight: "500", textAlign: "center" } },
                    "📖 Note"
                ),
                React.createElement(
                    RN.Text,
                    {
                        style: {
                            color: "#FFFFFF",
                            fontSize: 12,
                            marginTop: 4,
                            textAlign: "center",
                            flexShrink: 1,
                        }
                    },
                    "Read documentation and alternative bypass methods. Please note this plugin was tested on 290+. We won't support any versions below 290 as stated in Vencore docs (click here to read more)."
                )
            )
        )
    );
};
