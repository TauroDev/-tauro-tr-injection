"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
exports.AddClassContainer = AddClassContainer;
exports.AddPropertyContainer = AddPropertyContainer;
exports.AddMethodContainer = AddMethodContainer;
exports.ContainerGet = ContainerGet;
require("reflect-metadata");
class ContainerBuilder {
    constructor() {
        this.services = new Map();
    }
    add(serviceId, value) {
        if (this.services.has(serviceId)) {
            throw new Error(`Service with id ${serviceId} is already registered.`);
        }
        this.services.set(serviceId, value);
    }
    get(serviceId) {
        const service = this.services.get(serviceId);
        if (!service) {
            throw new Error(`Service with id ${serviceId} not found.`);
        }
        return service;
    }
    AddClassContainer(serviceId) {
        return (target) => {
            this.add(serviceId, new target());
        };
    }
    AddPropertyContainer(serviceId) {
        return (target, propertyKey) => {
            const value = target[propertyKey];
            this.add(serviceId, value);
        };
    }
    AddMethodContainer(serviceId) {
        return (target, propertyKey, descriptor) => {
            const originalMethod = descriptor.value;
            this.add(serviceId, originalMethod);
        };
    }
    ContainerGet(serviceId) {
        return (target, propertyKey) => {
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
exports.container = new ContainerBuilder();
function AddClassContainer(serviceId) {
    return function (target) {
        exports.container.add(serviceId, new target());
    };
}
function AddPropertyContainer(serviceId) {
    return function (target, propertyKey) {
        const value = target[propertyKey];
        exports.container.add(serviceId, value);
    };
}
function AddMethodContainer(serviceId) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        exports.container.add(serviceId, originalMethod);
    };
}
function ContainerGet(serviceId) {
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return exports.container.get(serviceId);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
