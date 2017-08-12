#include <node.h>

namespace demo {

  using v8::FunctionCallbackInfo;
  using v8::Exception;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Value;

  /*
    Generates an API key of a given length and returns as node.js module
  */
  void genAPIKey(const FunctionCallbackInfo<Value>& args) {
    Isolate *isolate = args.GetIsolate();

    if (args.Length() != 1) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong number of arguments")));
      return;
    }
    if (!args[0]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong arguments")));
      return;
    }
    int keylen = args[0]->NumberValue();

    char key[keylen+1];
    char alphaNum[] = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    srand(time(NULL)); // ensure random generation

    int i;
    for (i = 0; i < keylen; i++)
        key[i] = alphaNum[rand()%62];
    key[keylen] = '\0'; // Null terminate

    // Return key as a JS object
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, key));
  }

  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "apikey", genAPIKey);
  }

  NODE_MODULE(keygen, init)
}
