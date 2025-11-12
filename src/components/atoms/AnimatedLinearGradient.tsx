import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
    onPress: () => void;
    children: ReactNode;
};

export const AnimatedGradientButton = ({ onPress, children }: Props) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 5000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 5000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, []);

    const wave = animatedValue.interpolate({
        inputRange: [0, 0],
        outputRange: [0, 1],
    });

    const invertedWave = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    const start = { x: wave, y: 0 };
    const end = { x: invertedWave, y: 1 };

    return (
        <AnimatedLinearGradient
            colors={['#330000', '#8B0000', '#D32719']}

            start={start}
            end={end}
            style={[styles.gradient, { width: '100%' }]} // ocupa toda a largura
        >
            <TouchableOpacity onPress={onPress}>
                {children}
            </TouchableOpacity>
        </AnimatedLinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 12,
        overflow: 'hidden',
        // margin: 10,
        shadowColor: '#8E24AA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

