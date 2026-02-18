import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";

actor {
  type WatermarkPosition = {
    #topLeft;
    #topRight;
    #bottomLeft;
    #bottomRight;
    #center;
  };

  type WatermarkConfig = {
    text : Text;
    opacity : Float;
    fontSize : Nat;
    rotation : Nat;
    position : WatermarkPosition;
    fontStyle : Text;
  };

  type UserId = Nat;

  let watermarkConfigs = Map.empty<UserId, WatermarkConfig>();

  include MixinStorage();

  public shared ({ caller }) func setWatermarkConfig(userId : UserId, config : WatermarkConfig) : async () {
    watermarkConfigs.add(userId, config);
  };

  public query ({ caller }) func getWatermarkConfig(userId : UserId) : async WatermarkConfig {
    switch (watermarkConfigs.get(userId)) {
      case (null) { Runtime.trap("WatermarkConfig not found for userId: " # userId.toText()) };
      case (?config) { config };
    };
  };

  func getWavedWordToPdfUrl(docxUrl : Text) : Text {
    "https://demo.waved.cloud/convert?docx=" # docxUrl # "&pdf";
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func convertWordToPdf(docxFile : Text) : async Text {
    let url = getWavedWordToPdfUrl(docxFile);
    await OutCall.httpGetRequest(url, [], transform);
  };
};
