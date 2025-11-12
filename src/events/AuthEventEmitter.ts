import mitt from "mitt";

type Events = {
  logout: void;
};

export const authEventEmitter = mitt<Events>();
