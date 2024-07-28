import "reflect-metadata";

class ContainerBuilder {
  private services = new Map<string, any>();

  add(serviceId: string, value: any) {
    if (this.services.has(serviceId)) {
      throw new Error(`Service with id ${serviceId} is already registered.`);
    }
    this.services.set(serviceId, value);
  }

  get(serviceId: string): any {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service with id ${serviceId} not found.`);
    }
    return service;
  }

  AddClassContainer(serviceId: string): ClassDecorator {
    return (target: any) => {
      this.add(serviceId, new target());
    };
  }

  AddPropertyContainer(serviceId: string): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
      const value = target[propertyKey];
      this.add(serviceId, value);
    };
  }

  AddMethodContainer(serviceId: string): MethodDecorator {
    return (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      const originalMethod = descriptor.value;
      this.add(serviceId, originalMethod);
    };
  }

  ContainerGet(serviceId: string): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
      Object.defineProperty(target, propertyKey, {
        get: () => {
          return this.get(serviceId);
        },
        enumerable: true,
        configurable: true,
      });
    };
  }
}

export const container = new ContainerBuilder();

export function AddClassContainer(serviceId: string): ClassDecorator {
  return function (target: any) {
    container.add(serviceId, new target());
  };
}

export function AddPropertyContainer(serviceId: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const value = target[propertyKey];
    container.add(serviceId, value);
  };
}

export function AddMethodContainer(serviceId: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    container.add(serviceId, originalMethod);
  };
}

export function ContainerGet(serviceId: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return container.get(serviceId);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
