import "reflect-metadata";
declare class ContainerBuilder {
    private services;
    add(serviceId: string, value: any): void;
    get(serviceId: string): any;
    AddClassContainer(serviceId: string): ClassDecorator;
    AddPropertyContainer(serviceId: string): PropertyDecorator;
    AddMethodContainer(serviceId: string): MethodDecorator;
    ContainerGet(serviceId: string): PropertyDecorator;
}
export declare const container: ContainerBuilder;
export declare function AddClassContainer(serviceId: string): ClassDecorator;
export declare function AddPropertyContainer(serviceId: string): PropertyDecorator;
export declare function AddMethodContainer(serviceId: string): MethodDecorator;
export declare function ContainerGet(serviceId: string): PropertyDecorator;
export {};
