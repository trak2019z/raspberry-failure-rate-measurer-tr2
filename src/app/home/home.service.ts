import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs/operators";
import { Subject } from "rxjs";

import { HomeAccountData } from "./home-account.data.model";
import { HomeServerroomData } from "./home-serverroom.data";
import { HomeSupervisionData } from "./home-supervision.data.model";

const url = "http://localhost:3000/api/home/";

@Injectable({ providedIn: "root" })
export class HomeService {
    private disabledAccounts: HomeAccountData[] = [];
    private activeAccounts: HomeAccountData[] = [];
    private disabledAccountsList = new Subject<{accounts: HomeAccountData[]}>();
    private activeAccountsList = new Subject<{accounts: HomeAccountData[]}>();
    private createResult = new Subject<{code: number}>();
    private createServerRoomStatusListener = new Subject<boolean>();
    private serverrooms: HomeServerroomData[] = [];
    private serverRoomsList = new Subject<{serverrooms: HomeServerroomData[]}>();
    private changePasswordListener = new Subject<boolean>();
    private supervisionedServerRooms: HomeSupervisionData[] = [];
    private supervisionedServerRoomsList = new Subject<{serverRooms: HomeSupervisionData[]}>();
    private serverRoomPreferences = {};
    private currentServerRoomPreferences = new Subject<{}>();

    constructor(private http: HttpClient) {}

    getNotActiveAccountsList() {
        this.http.get<{message: string, accounts: any}>(url + "administration/accounts/disabled")
        .pipe(map((accountsData) => {
            return { accounts: accountsData.accounts.map(account => {
                return {
                    id: account._id,
                    login: account.login,
                    isActive: account.isActive
                };
            })};
        }))
        .subscribe((transformedAccountsData) => {
            this.disabledAccounts = transformedAccountsData.accounts;
            this.disabledAccountsList.next(
                {
                  accounts: [...this.disabledAccounts]
                });
        });
    }

    getDisabledAccountsListener() {
        return this.disabledAccountsList.asObservable();
    }

    getActiveAccountsList() {
        this.http.get<{message: string, accounts: any}>(url + "administration/accounts/active")
        .pipe(map((accountsData) => {
            return { accounts: accountsData.accounts.map(account => {
                return {
                    id: account._id,
                    login: account.login,
                    isActive: account.isActive
                };
            })};
        }))
        .subscribe((transformedAccountsData) => {
            this.activeAccounts = transformedAccountsData.accounts;
            this.activeAccountsList.next(
                {
                  accounts: [...this.activeAccounts]
                });
        });
    }

    getActiveAccountsListener() {
        return this.activeAccountsList.asObservable();
    }

    activateAccount(id: string, login: string) {
        const obj = { accountId: id, login: login }
        this.http.put(url + "administration/accounts/activate", obj)
        .subscribe(result => {
            const disabledList = [...this.disabledAccounts];
            const index = disabledList.findIndex(account => account.id == obj.accountId);
            disabledList[index].isActive = 1;
            this.activeAccounts.push(disabledList[index]);
            this.activeAccountsList.next({
                accounts: [...this.activeAccounts]
            });
            const updatedAccountsList = this.disabledAccounts.filter(account => account.id != obj.accountId);
            this.disabledAccounts = updatedAccountsList;
            this.disabledAccountsList.next({
                accounts: [...this.disabledAccounts]
            })
        })
    }

    disableAccount(id: string, login: string) {
        const obj = { accountId: id, login: login }
        this.http.put(url + "administration/accounts/disable", obj)
        .subscribe(result => {
            const activatedList = [...this.activeAccounts];
            const index = activatedList.findIndex(account => account.id == obj.accountId);
            activatedList[index].isActive = 0;
            this.disabledAccounts.push(activatedList[index]);
            this.disabledAccountsList.next({
                accounts: [...this.disabledAccounts]
            });
            const updatedAccountsList = this.activeAccounts.filter(account => account.id != obj.accountId);
            this.activeAccounts = updatedAccountsList;
            this.activeAccountsList.next({
                accounts: [...this.activeAccounts]
            })
        })
    }

    giveAccountAdminPrivileges(id: string, login: string) {
        const obj = { accountId: id, login: login }
        this.http.put(url + "administration/accounts/privileges", obj)
        .subscribe(result => {
            const updatedAccountsList = this.activeAccounts.filter(account => account.id != obj.accountId);
            this.activeAccounts = updatedAccountsList;
            this.activeAccountsList.next({
                accounts: [...this.activeAccounts]
            })
        })
    }

    createServerRoom(name: string, address: string, city: string) {
        const serverRoomData: HomeServerroomData = { name: name, address: address, city: city};
        this.http.post(url + "administration/servers/create", serverRoomData)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
            const newServerRoom = {
                id: result.result._id,
                name: result.result.name,
                city: result.result.city,
                address: result.result.address
            }
            this.serverrooms.push(newServerRoom);
            this.serverRoomsList.next(
                {
                    serverrooms: [...this.serverrooms]
                });
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
            this.createServerRoomStatusListener.next(false);
        })
    }

    getCreateResult() {
        return this.createResult.asObservable();
    }

    getServerRoomsList() {
        this.http.get<{message: string, serverrooms: any}>(url + "administration/servers/serverrooms")
        .pipe(map((serverRoomsData) => {
            return { serverrooms: serverRoomsData.serverrooms.map(serverroom => {
                return {
                    id: serverroom._id,
                    name: serverroom.name,
                    address: serverroom.name,
                    city: serverroom.city
                }
            })};
        }))
        .subscribe((transformedServerRoomsData) => {
            this.serverrooms = transformedServerRoomsData.serverrooms;
            this.serverRoomsList.next(
                {
                    serverrooms: [...this.serverrooms]
                });
        });
    }

    getServerRoomsListener() {
        return this.serverRoomsList.asObservable();
    }

    deleteServerRoom(name: string) {
        this.http.delete(url + "/administration/servers/serverrooms/delete/" + name)
        .subscribe(() => {
            const updatesServerRoomsList = this.serverrooms.filter(serveroom => serveroom.name !== name);
            this.serverrooms = updatesServerRoomsList;
            this.serverRoomsList.next(
                {
                    serverrooms: [...this.serverrooms]
                }
            )
        });
    }

    createRelationBetweenUserAndServerRoom(account: string, serverRoom: string) {
        const newRelation = { accountId: account, serverRoomName: serverRoom};
        this.http.post(url + "administration/relations", newRelation)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
            this.createServerRoomStatusListener.next(false);
        })
    }

    deleteRelationBetweenUserAndServerRoom(account: string, serverRoom: string) {
        this.http.delete(url + "administration/relations/delete/" + account + "/" + serverRoom)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
            this.changePasswordListener.next(false);
        })
    }

    changePassword(userId: string, oldPassword: string, newPassword: string, repeatedPassword: string) {
        const obj = { userId: userId, oldPassword: oldPassword, newPassword: newPassword, repeatedPassword: repeatedPassword};
        this.http.put(url + "user/account", obj)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
        })
    }

    getServerRoomsUnderUserCare(userId: string) {
        this.http.get<{message: string, serverRooms: any}>(url + "user/relations/" + userId)
        .pipe(map((data) => {
            return { serverRooms: data.serverRooms.map(supervision => {
                return {
                    id: supervision._id,
                    userId: supervision.userId,
                    serverRoomName: supervision.serverRoomName,
                    serverRoomAddress: supervision.serverRoomAddress,
                    serverRoomCity: supervision.serverRoomCity
                };
            })};
        }))
        .subscribe((transformedServerRooms) => {
            this.supervisionedServerRooms = transformedServerRooms.serverRooms;
            this.supervisionedServerRoomsList.next(
                {
                    serverRooms: [...this.supervisionedServerRooms]
                });
        });
    }

    getSupervisionedRoomsListener() {
        return this.supervisionedServerRoomsList.asObservable();
    }

    renounceSupervision(account: string, serverRoomName: string) { 
        this.http.delete(url + "administration/relations/delete/" + account + "/" + serverRoomName)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
            const updatedSupervisionList = this.supervisionedServerRooms.filter(serverRoom => serverRoom.serverRoomName !== serverRoomName);
            this.supervisionedServerRooms = updatedSupervisionList;
            this.supervisionedServerRoomsList.next(
                {
                    serverRooms: [...this.supervisionedServerRooms]
                })
            }, error => {
            this.createResult.next({
                code: error.error.code
            });
        })
    }

    updateServerRoomPreferences(serverRoom: string, minTmp: number, maxTmp: number, minHum: number, maxHum: number) {
        const obj = { serverRoomName: serverRoom, minimumTemperature: minTmp, maximumTemperature: maxTmp, minimumHumidity: minHum, maximumHumidity: maxHum };
        this.http.put(url + "user/serverroom/preferences/update", obj)
        .subscribe((result: any) => {
            this.createResult.next({
                code: result.code
            })
        }, error => {
            this.createResult.next({
                code: error.error.code
            });
        })
    }

    getServerRoomPreferences(serverRoom: string) {
        this.http.get<{message: string, preferences: any }>(url + "/user/serverroom/preferences/" + serverRoom)
        .subscribe(result => {
            this.serverRoomPreferences = result.preferences[0];
            this.currentServerRoomPreferences.next(this.serverRoomPreferences);
        })
    }

    getServerRoomPreferencesListener() {
        return this.currentServerRoomPreferences.asObservable();
    }
}