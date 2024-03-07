export function addConstant(object, property, value) {
  Object.defineProperty(object, property, {
    configurable: false,
    enumerable: true,
    writable: false,
    value
  });
}

export function addConstants(Constructor, propertyMap) {
  for (const property in propertyMap) {
    const value = propertyMap[property];
    addConstant(Constructor, property, value);
  }
}

export function mixin(target, source, allowKeys = []) {
  const keys = Reflect.ownKeys(source);
  for (let i = 0; i < keys.length; ++i) {
    if (keys[i] in target && !allowKeys.includes(keys[i])) {
      continue;
    }
    Object.defineProperty(target, keys[i], Object.getOwnPropertyDescriptor(source, keys[i]));
  }
};

