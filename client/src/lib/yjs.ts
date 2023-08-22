import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

function addWebRtcProvider(ydoc, documentName, user = {}) {
  const webrtcProvider = new WebrtcProvider(documentName, ydoc, {
    signaling: ["ws://localhost:5173/ws/signal"],
  } as any);
  webrtcProvider.awareness.setLocalStateField("user", user);
}

export class YDoc {
  private doc: Y.Doc = new Y.Doc();
  constructor(documentName) {
    addWebRtcProvider(this.doc, documentName);
    this.object_list.observeDeep((evt) => {
      console.log("changed...", this.object_list.toJSON());
    });
  }
  get object_list() {
    return this.doc.getArray<Y.Map<any>>("objects");
  }

  add_object(obj: Y.Map<any>) {
    this.object_list.push([obj]);
  }
}

export function createObject(pos: { x; y }, text: string) {
  const meta = new Y.Map<any>();
  meta.observe(() => {
    console.log({ meta: meta.toJSON() });
  });
  meta.set("x", pos.x);
  meta.set("y", pos.y);
  const content = new Y.Text();
  content.insert(0,"Hello World")
  meta.set("content", content);
  return meta;
}
