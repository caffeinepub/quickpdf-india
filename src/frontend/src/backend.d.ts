import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WatermarkConfig {
    rotation: bigint;
    fontStyle: string;
    text: string;
    position: WatermarkPosition;
    fontSize: bigint;
    opacity: number;
}
export type UserId = bigint;
export enum WatermarkPosition {
    center = "center",
    bottomLeft = "bottomLeft",
    topRight = "topRight",
    bottomRight = "bottomRight",
    topLeft = "topLeft"
}
export interface backendInterface {
    getWatermarkConfig(userId: UserId): Promise<WatermarkConfig>;
    setWatermarkConfig(userId: UserId, config: WatermarkConfig): Promise<void>;
}
