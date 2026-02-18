import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface WatermarkConfig {
    rotation: bigint;
    fontStyle: string;
    text: string;
    position: WatermarkPosition;
    fontSize: bigint;
    opacity: number;
}
export type UserId = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum WatermarkPosition {
    center = "center",
    bottomLeft = "bottomLeft",
    topRight = "topRight",
    bottomRight = "bottomRight",
    topLeft = "topLeft"
}
export interface backendInterface {
    convertWordToPdf(docxFile: string): Promise<string>;
    getWatermarkConfig(userId: UserId): Promise<WatermarkConfig>;
    setWatermarkConfig(userId: UserId, config: WatermarkConfig): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
