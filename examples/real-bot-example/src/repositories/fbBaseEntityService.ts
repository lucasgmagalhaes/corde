import { EmojiPeople } from "../enums/emojis";

// import * as firebase from "firebase";
// import "firebase/database";
// import * as connections from "../../config";
// import { Entity } from "../models/entity";

/**
 * @deprecated
 * Contains all method for a CRUD of an entity
 */
export class FbBaseEntityService<T> {
  // protected db: firebase.database.Database;
  protected db = null;

  constructor() {
    // const app = firebase.initializeApp(connections.firebaseConnection);
    this.db = null;
  }

  /**
   * Save a entity into database based in the informed route
   * @param object
   * @param route
   */
  protected create(route: string, object: T): void {
    this.db.ref(route).push(object);
  }

  /**
   * Searchs for a element, or group of elements based in the path where
   * they are located
   * @param route path where the group of data is located
   * @param key identifier of the data
   */
  protected find(route: string, key: string): Promise<T> {
    return this.db
      .ref(route + "/" + key)
      .once("value")
      .then(function (snapshot) {
        return new Promise<T>((resolve) => {
          resolve(snapshot.val());
        });
      })
      .catch((error) => {
        console.log(error);
        return Promise.reject<T>(
          "I found an problem trying to load your hero informations " +
            EmojiPeople["😰"] +
            ". Try again later",
        );
      });
  }

  protected findAll(route: string): Promise<T> {
    return this.db
      .ref(route + "/")
      .once("value")
      .then(function (snapshot) {
        return new Promise<T>((resolve) => {
          resolve(snapshot.val());
        });
      })
      .catch((error) => {
        console.log(error);
        return Promise.reject<T>(
          "I found a problem when trying to collect the information " +
            EmojiPeople["😰"] +
            ". Try again later",
        );
      });
  }

  /**
   * Removes data from database
   * @param route path where the entity is located
   * @param id  indentifier of the entity
   */
  protected delete(route: string, id: string): Promise<void> {
    return this.db
      .ref(route + "/" + id)
      .remove()
      .then(function (snapshot) {
        return new Promise<void>((resolve) => {
          resolve(snapshot.val());
        });
      })
      .catch((error) => {
        console.log(error);
        return Promise.reject<void>(
          "I found a problem when trying to delete the information " +
            EmojiPeople["😰"] +
            ". Try again later",
        );
      });
  }

  /**
   * Replace all informations of a entity will new values
   * @param route path where the entity is located
   * @param entity object that will be removed
   */
  // protected update(route: string, entity: Entity): Promise<void> {
  //   const id = entity.id;
  //   this.adjustEntity(entity);
  //   delete entity.id;

  //   return this.db
  //     .ref(route + "/" + id)
  //     .update(entity)
  //     .then(function () {
  //       return new Promise<void>(resolve => {
  //         resolve();
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       return Promise.reject<void>(
  //         "I found an problem when trying to update your hero's informations " +
  //         Emojis.SAD_CRYING +
  //         ". Try again later"
  //       );
  //     });
  // }

  /**
   * Remove all actual values of an entity from database and put the actual properties of the
   * entity of the object
   * @param route path to set the values
   * @param entity who will have properties changed
   */
  // protected set(route: string, entity: Entity): Promise<void> {
  //   delete entity.id;
  //   return this.db
  //     .ref(route)
  //     .set(entity)
  //     .then(function () {
  //       return new Promise<void>(resolve => {
  //         resolve();
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       return Promise.reject<void>(
  //         "I found an problem when trying to set your hero's informations " +
  //         Emojis.SAD_CRYING +
  //         ". Try again later"
  //       );
  //     });
  // }

  // private adjustEntity(entity: Entity) {
  //   Object.getOwnPropertyNames(entity).forEach(proper => {
  //     Object.defineProperty(
  //       entity,
  //       proper.replace("_", ""),
  //       Object.getOwnPropertyDescriptor(entity, proper)
  //     );
  //     delete Object(entity)["_" + proper];
  //   });
  // }
}
