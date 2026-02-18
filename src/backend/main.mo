import MixinStorage "blob-storage/Mixin";
import Blob "mo:core/Blob";

actor {
  include MixinStorage();

  public shared ({ caller }) func convertWordToPdf(_wordBlob : Blob, _extraHeaders : [(Text, Text)]) : async () {
    ();
  };
};
