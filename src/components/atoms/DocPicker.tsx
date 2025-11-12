import React, { useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { FormStyles } from '../../style/FormStyles'
import { Button, Modal, Portal } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import { uploadFile } from '../../services/file/fileService'

export const DocPicker = () => {

    const navigation = useNavigation()

    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [errorModalVisibility, setErrorModalVisibility] = useState(false)
    const [confirmationModalVisibility, setConfirmationModalVisibility] = useState(false)
    const [successModalVisibility, setSuccessModalVisibility] = useState(false)

    const pick = async () => {

        try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 2000)) // espera 3 segundos
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            })

            if (!result.canceled) {
                const data = result.assets[0]

                setFile(data)
                setConfirmationModalVisibility(true)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }


    }



    const handleSubmit = async () => {
        setLoading(true)
        try {
            if (file) {
                await uploadFile(file)
                setSuccessModalVisibility(true)
            }
        } catch (dataError: any) {
            const errorMsg =
                dataError.response?.data?.mensagem ||
                "Erro inesperado. Tente novamente.";
            setError(errorMsg)
            setErrorModalVisibility(true)
        } finally {
            setLoading(false)
            setConfirmationModalVisibility(false)
        }
    }


    return (
        <View >
            <Button
                mode="contained"
                buttonColor="green"
                labelStyle={{ color: "white" }}
                style={[FormStyles.button, { backgroundColor: "#08A93C", width: "100%" }]}
                onPress={pick}
            >
                Importar Planilha
            </Button>

            <Portal>
                {/*Error Modal */}
                <Modal
                    visible={errorModalVisibility}
                    onDismiss={() => setErrorModalVisibility(false)}
                    contentContainerStyle=
                    {{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}>
                    <Text style={[FormStyles.description, { fontSize: 17, color: "black", fontWeight: 'bold' }]}>Erro</Text>
                    <Text style={FormStyles.description}>{error}</Text>
                    <Button
                        onPress={() => setErrorModalVisibility(false)}
                        style={FormStyles.button}
                        labelStyle={{ color: "white" }}
                    > Confirmar</Button>
                </Modal>

                {/*Confirmation Modal*/}
                <Modal
                    visible={confirmationModalVisibility}
                    onDismiss={() => setConfirmationModalVisibility(false)}
                    contentContainerStyle=
                    {{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}>
                    <Text>Certeza que deseja subir a planilha "{file?.name}" ?</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 40 }}>

                        <Button
                            mode="outlined"
                            labelStyle={{ color: 'black' }}

                            style={{ flex: 1 }}
                            onPress={() => setConfirmationModalVisibility(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: '#08A93C' }}
                            labelStyle={{ color: 'white' }}
                            onPress={handleSubmit}
                        >
                            Confirmar
                        </Button>
                    </View>

                </Modal>

                {/*Success Modal*/}
                <Modal
                    visible={successModalVisibility}
                    onDismiss={() => setConfirmationModalVisibility(false)}
                    contentContainerStyle=
                    {{
                        backgroundColor: 'white',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                    }}>
                    <Text>Professores Cadastrados com Sucesso!</Text>
                    <View style={{ gap: 10, marginTop: 40 }}>

                        <LottieView
                            source={require("../../../assets/success.json")}
                            autoPlay
                            loop
                            speed={0.5}
                            style={{
                                width: "100%",
                                height: 150, // ou a altura que quiser
                                alignSelf: "center",

                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 10,
                                marginTop: 20,
                            }}
                        >
                            <Button
                                mode="contained"
                                buttonColor="#08A93C"
                                labelStyle={{ color: 'white', fontSize: 12 }}
                                style={{ flex: 1 }}
                                onPress={() => {
                                    setSuccessModalVisibility(false)
                                    navigation.navigate("ListProfessors" as never)
                                }}
                            >
                                Ver professores
                            </Button>

                            <Button
                                mode="outlined"
                                labelStyle={{ color: 'black', fontSize: 9 }}
                                style={{ flex: 1 }}
                                onPress={() => setConfirmationModalVisibility(false)}
                            >
                                Continuar cadastrando
                            </Button>
                        </View>
                    </View>

                </Modal>
            </Portal>

            <Portal>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
            </Portal>

        </View>
    )
}

const styles = StyleSheet.create({
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // fundo semi-transparente
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
});
