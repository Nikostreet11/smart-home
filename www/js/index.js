/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$(document).ready(function() {
//$(document).bind("pageinit", function() { // shoots events twice
	app.initialize();
});

var app = {
	availableDevices: [],
	connectedDevice: undefined,
	//activeUser: undefined,
	currentProfile: undefined,
	currentRoom: undefined,
	currentItem: undefined,
	currentSmartset: undefined,
	EDIT_PROFILES_MODE: false,
	EDIT_ROOMS_MODE: false,
	EDIT_ITEMS_MODE: false,
	BINARY_ITEM: 0,
	LINEAR_ITEM: 1,
	RADIO_ITEM: 2,
	AVATARS: ["avatar-0", "avatar-1", "avatar-2", "avatar-3", "avatar-4",
		"avatar-5", "avatar-6", "avatar-7", "avatar-8", "avatar-9", "avatar-10",
		"avatar-11",],
	ROOM_ICONS: ["001-bath", "002-bed", "003-bench", "004-bedside-table",
		"005-book-shelf", "006-book-shelf-1", "007-cabinet", "008-cradle",
		"009-chair", "010-chair-1", "011-chair-2", "012-closet",
		"013-coffee-table", "014-desk", "015-desktop", "016-picture",
		"017-furniture", "018-living-room", "019-hanger", "020-kitchen-set",
		"021-kitchen", "022-kitchen-table", "023-kitchen-1",
		"024-kitchen-table-1", "025-lamp", "026-nightstand", "027-nightstand-1",
		"028-office-chair", "029-rocking-chair", "030-shelf", "031-sofa",
		"032-chair-3", "033-stool", "034-television", "035-bunk", "036-sink",],
	ITEM_ICONS: ["001-wifi", "002-thermometer", "003-refrigerator", "004-lamp",
		"005-washing-machine", "006-real-estate", "007-eco-house", "008-smart-home",
		"009-danger", "010-home", "011-light-bulb", "012-smartphone",
		"013-home-1", "014-setting", "015-house", "016-air-conditioner",
		"017-plant", "018-cup", "019-smart-home-1", "020-garage",
		"021-firefighting", "022-temperature-control", "023-security-camera",
		"024-wifi-1", "025-locker", "026-smart-home-2", "027-smart-key",
		"028-faucet", "029-music", "030-telephone", "031-password",
		"032-speakers", "033-fireplace", "034-smart-home-3", "035-dimmer", "036-plug",
		"037-plug-1", "038-heater",
		"039-smart-home-4", "040-weather", "041-degree", "042-temperature",
		"043-scales", "044-modem", "045-smart-lock", "046-recycle-bin",
		"047-light-bulb-1", "048-water", "049-house-1", "050-vision",],
	clickManager: {
		timerId: null,
		active: false,
	},
	// DEBUG
	debugHost: 8,
	//--------------------

	
	initialize: function() {
		app.refreshAvatars(app.AVATARS);
		app.refreshRoomIcons(app.ROOM_ICONS);
		app.refreshItemIcons(app.ITEM_ICONS);
		
		
		
/********** WELCOME ***********************************************************/
		
		$("#welcome-page .connect-btn").click(function() {
			app.changePage("#sign-in-page");
		});
		
		
		
/********** SIGN IN ***********************************************************/
		
		$("#sign-in-page .back-btn").click(function() {
			app.changePage("#welcome-page");
		});
		
		$("#sign-in-page .refresh-btn").click(function() {
			app.refreshDevices();
		});
		
		$("#sign-in-page .submit-btn").click(function() {
			var device = $("#sign-in-page input[name=\"available-devices\"]:checked");
			
			app.connectedDevice = {
				"device-name" : device.attr("device-name"),
				"address" : device.attr("address"),
			};
			
			app.changePage("#profiles-page");
			
			/*if (app.connectedDevice != undefined) {
				
				var name = $("#signInPage input[name='name']").val();
				var password = $("#signInPage input[name='password']").val();
			
				if(app.arduino.signInUser(name, password)) {
					app.activeUser = name;
					alert("Hi " + app.activeUser + "!");
					app.changePage("#profilesPage");
				}
				else {
					alert("Error: login failed");
				}
			}
			else
				alert("Error: device not found");*/
		});
		
		
/********** REGISTER **********************************************************/
		
		/*
		$("#registerPage .submitBtn").click(function() {
			if (app.connectedDevice != undefined) {
				var name = $("#registerPage input[name='name']").val();
				var password = $("#registerPage input[name='password']").val();
				if (password == 
						$("#registerPage input[name='passwordCheck']").val()) {
					if(app.arduino.registerUser(name, password)) {
						app.activeUser = name;
						alert("Hi " + app.activeUser + "!");
						app.changePage("#profilesPage");
					}
					else {
						alert("Error: registration failed");
					}
				}
				else {
					alert("Error: passwords not matching");
				}
			}
			else
				alert("Error: device not found");
		});
		*/
		
		
/********** PROFILES **********************************************************/
		
		$("#profiles-page .log-out-btn").click(function() {
			app.activeUser = undefined;
			app.changePage("#welcome-page");
		});
		
		$("#profiles-page .edit-btn").click(function() {
			if (app.EDIT_PROFILES_MODE) {
				app.setEditProfilesMode(false);
			}
			else {
				app.setEditProfilesMode(true);
			}
		});
		
		$("#profiles-page .add-btn").click(function() {
			app.changePage("#add-profile-page");
		});
		
		// must use "on" because .profile is dynamically generated
		$("#profiles-page").on("click", ".profile", function() {
			app.arduino.getProfile(this.getAttribute("id"))
				.then(function(result) {
					var response = JSON.parse(result);
				
					if (response.outcome == "success") {
						app.currentProfile = response.profile;
				
						if (app.EDIT_PROFILES_MODE) {
							app.changePage("#edit-profile-page");
						}
						else {
							app.changePage("#control-panel-page");
						}
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("getProfile::error");
				});
		});
		
		
/********** EDIT PROFILE ******************************************************/
		
		$("#edit-profile-page .cancel-btn").click(function() {
			app.currentProfile = undefined;
			app.cleanupEditProfilePage();
			app.changePage("#profiles-page");
		});
		
		$("#edit-profile-page .confirm-btn").click(function() {
			var newProfile = {
				"name" : $("#edit-profile-page input[name='name']").val(),
				"avatar" : $("#edit-profile-page input[name=\"avatars\"]:checked").val(),
			};
			
			/*if ($("#edit-profile-page input[name='edit-password-checkbox']")[0].checked) {
				var newPassword = $("#edit-profile-page input[name='new-password']").val();
				if (newPassword == $("#edit-profile-page input[name='new-password-check']").val())
					if (newPassword != password)
						result = app.arduino.editProfile(name, password, avatar, newPassword);
					else {
						alert("Error: you must choose a different password");
						return;
					}
				else {
					alert("Error: passwords not matching");
					return;
				}
			}
			else*/
			if (newProfile.name != "" &&
					!newProfile.name.includes(" ") &&
					newProfile.avatar != undefined) {
				app.arduino.editProfile(app.currentProfile, newProfile)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						//alert("Profile saved successfully");

						app.currentProfile = undefined;
						app.cleanupEditProfilePage();
						app.changePage("#profiles-page");
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("editProfile::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		/*$("#edit-profile-page input[name=\"edit-password-checkBox\"]").change(function() {
			if (this.checked == true)
				$("#edit-profile-page .edit-password-container").css("display", "block");
			else
				$("#edit-profile-page .edit-password-container").css("display", "none");
		});*/
		
		$("#edit-profile-page .remove-btn").click(function() {
			app.arduino.removeProfile(app.currentProfile)
			.then(function(response) {
				var outcome = JSON.parse(response).outcome;

				if (outcome == "success") {
					app.currentProfile = undefined;
					app.cleanupEditProfilePage();
					app.changePage("#profiles-page");
				}
				else {
					alert(JSON.parse(response).error);
				}
			})
			.catch(function() {
				alert("removeProfile::error");
			});
		});

		
/********** ADD PROFILE *******************************************************/
		
		$("#add-profile-page .cancel-btn").click(function() {
			app.cleanupAddProfilePage();
			app.changePage("#profiles-page");
		});
		
		$("#add-profile-page .confirm-btn").click(function() {
			var profile = {
				"name" : $("#add-profile-page input[name='name']").val(),
				"avatar" : $("#add-profile-page input[name=\"avatars\"]:checked").val(),
			};
			
			if (profile.name != "" &&
					!profile.name.includes(" ") &&
					profile.avatar != undefined) {
				app.arduino.addProfile(profile)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {

						app.cleanupAddProfilePage();
						app.changePage("#profiles-page");
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("addProfile::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		
/********** SIGN IN PROFILE ***************************************************/
		
		// TODO: ADD IN A FUTURE RELEASE
		
		/*
		$("#signInProfilePage .backBtn").click(function() {
			app.currentProfile = undefined;
			app.changePage("#profilesPage");
		});
		
		$("#signInProfilePage .submitBtn").click(function() {
			var password = $("#signInProfilePage input[name='password']").val();
			if (app.arduino.signInProfile(app.currentProfile, password)) {
				alert("Sign in successfully!");
				app.changePage("#controlPanelPage");
			}
			else
				alert("Error: login failed");
		});
		*/
		
		
/********** CONTROL PANEL *****************************************************/
		
		$("#control-panel-page .menu-btn").click(function() {
			//TODO: replace these operation with: open side menu
			app.currentProfile = undefined;
			app.changePage("#profiles-page");
		});
		
		$("#control-panel-page .edit-btn").click(function() {
			if (app.EDIT_ROOMS_MODE)
				app.setEditRoomsMode(false);
			else
				app.setEditRoomsMode(true);
		});
		
		$("#control-panel-page .add-btn").click(function() {
			app.changePage("#add-room-page");
		});
		
		$("#control-panel-page").on("click", ".room", function() {
			/*app.arduino.getRoom(this.getAttribute("id"), app.currentProfile)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentRoom = response.room;

					if (app.EDIT_ROOMS_MODE) {
						app.changePage("#edit-room-page");
					}
					else {
						app.changePage("#manual-panel-page");
					}
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getRoom::error");
			});*/
		});
		
		/*$("#control-panel-page")
		.on("mousedown", ".room", function() {
			app.timeoutId = setTimeout(function() {
				//alert('bauuuuuu');
			}, 1000);
		});*/
		
		$("#control-panel-page")
		.on("mousedown", ".room", function() {				
			app.clickManager.active = true;
			app.clickManager.timerId = setTimeout(function() {
				clearTimeout(app.clickManager.timerId);
				app.clickManager.timerId = null;
			}, 500);
		})
		.on('mouseup', ".room", function() {
			if (app.clickManager.active) {
				if (app.clickManager.timerId) {
					// click
					app.arduino.getRoom(this.getAttribute("id"), app.currentProfile)
					.then(function(result) {
						var response = JSON.parse(result);

						if (response.outcome == "success") {
							app.currentRoom = response.room;

							if (app.EDIT_ROOMS_MODE) {
								app.changePage("#edit-room-page");
							}
							else {
								app.changePage("#manual-panel-page");
							}
						}
						else {
							alert(response.error);
						}
					})
					.catch(function() {
						alert("getRoom::error");
					});
				}
				else {
					// hold
					
					// 	TODO: app.getToom()
					
					$('#smartsets-panel').css('display', 'block');
					/*var roomId = this.getAttribute("id");
					var roomSmart;
					if ($(this).attr("smart") == "true") {
						roomSmart = "false";
					}
					else {
						roomSmart = "true";
					}
					
					app.arduino.setRoomSmart(
							roomId,
							roomSmart,
							app.currentProfile)
					.then(function(result) {
						var response = JSON.parse(result);

						if (response.outcome == "success") {
							$("#control-panel-page #" + roomId).attr(
									"smart", response["room-smart"]);
						}
						else {
							alert(response.error);
						}
					})
					.catch(function() {
						alert("setRoomSmart::error");
					});*/
				}
			}
		})
		.on('mouseleave', ".room", function() {
			app.clickManager.active = false;
			clearTimeout(app.timer);
			app.timer = null;
		});
		
		$("#control-panel-page").on("click", ".add-smartset-btn", function() {
			alert('bau');
		});
		
		
/********** EDIT ROOM *********************************************************/
		
		$("#edit-room-page .cancel-btn").click(function() {
			app.currentRoom = undefined;
			app.cleanupEditRoomPage();
			app.changePage("#control-panel-page");
		});
		
		$("#edit-room-page .confirm-btn").click(function() {
			var newRoom = {
				"name" : app.dePrettyfy(
						$("#edit-room-page input[name='name']").val()),
				"icon" : $("#edit-room-page input[name=\"room-icons\"]:checked").val(),
			};
			
			if (newRoom.name != "" &&
					!newRoom.name.includes(" ") &&
					newRoom.icon != undefined) {
				app.arduino.editRoom(app.currentRoom, newRoom)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {
						//alert("Room saved successfully");

						app.currentRoom = undefined;
						app.cleanupEditRoomPage();
						app.changePage("#control-panel-page");
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("editRoom::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#edit-room-page .remove-btn").click(function() {
			app.arduino.removeRoom(app.currentRoom)
			.then(function(response) {
				var outcome = JSON.parse(response).outcome;

				if (outcome == "success") {
					app.currentRoom = undefined;
					app.cleanupEditRoomPage();
					app.changePage("#control-panel-page");
				}
				else {
					alert(JSON.parse(response).error);
				}
			})
			.catch(function() {
				alert("removeRoom::error");
			});
		});

/********** ADD ROOM **********************************************************/
		
		$("#add-room-page .cancel-btn").click(function() {
			app.cleanupAddRoomPage();
			app.changePage("#control-panel-page");
		});
		
		$("#add-room-page .confirm-btn").click(function() {
			var room = {
				"name" : app.dePrettyfy(
						$("#add-room-page input[name='name']").val()),
				"icon" : $("#add-room-page input[name=\"room-icons\"]:checked").val(),
			};
			
			if (room.name != "" &&
					!room.name.includes(" ") &&
					room.icon != undefined) {
				app.arduino.addRoom(room)
				.then(function(response) {
					var outcome = JSON.parse(response).outcome;

					if (outcome == "success") {

						app.cleanupAddRoomPage();
						app.changePage("#control-panel-page");
					}
					else {
						alert(JSON.parse(response).error);
					}
				})
				.catch(function() {
					alert("addRoom::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		
/********** MANUAL PANEL *****************************************************/
		
		$("#manual-panel-page .back-btn").click(function() {
			app.currentRoom = undefined;
			app.changePage("#control-panel-page");
		});
		
		$("#manual-panel-page .edit-btn").click(function() {
			if (app.EDIT_ITEMS_MODE)
				app.setEditItemsMode(false);
			else
				app.setEditItemsMode(true);
		});
		
		$("#manual-panel-page")
		.on("click", ".view-saved-smartsets-btn", function() {
			app.changePage('#smartsets-page');
		});
		
		$("#manual-panel-page")
		.on("click", ".item .active-btn", function() {
			var itemId = $(this).parent().attr("id");
			
			if (app.EDIT_ITEMS_MODE) {
				app.arduino.getItem(itemId, app.currentRoom, app.currentProfile)
				.then(function(result) {
					var response1 = JSON.parse(result);

					if (response1.outcome == "success") {
						app.arduino.getPorts()
						.then(function(result) {
							var response2 = JSON.parse(result);
							
							if (response2.outcome == "success") {
								app.currentItem = response1.item;
								app.refreshPorts(response2.ports);
								app.changePage("#edit-item-page");
							}
							else {
								alert(response2.error);
							}
						})
						.catch(function() {
							alert("getAvailablePorts::error");
						});
					}
					else {
						alert(response1.error);
					}
				})
				.catch(function() {
					alert("getItem::error");
				});
			}
			else {
				var itemActive;
				if ($(this).parent().attr("active") == "true") {
					itemActive = "false";
				}
				else {
					itemActive = "true";
				}
				
				app.arduino.setItemActive(itemId, itemActive, app.currentRoom)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						$("#manual-panel-page #" + itemId).attr(
								"active", response.active);
						// TODO: change appearance
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("turnOnItem::error");
				});
			}
		});
		
		$("#manual-panel-page .add-btn").click(function() {
			app.changePage("#add-item-page");
			
			app.arduino.getPorts()
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.refreshPorts(response.ports);
					app.changePage("#add-item-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getAvailablePorts::error");
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".item .smart .on-btn", function() {
			app.currentItem = {
				id : $(this).parents(".item").attr('id'),
				active : $(this).parents(".item").attr('active'),
			};
			app.arduino.getSmartsets(app.currentProfile, app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.loadSmartsets(response.smartsets);
					$('#manual-panel-page .smartsets-panel').css('display', 'block');
				}
				else {
					alert(response.error);
					app.currentItem = undefined;
				}
			})
			.catch(function() {
				alert("getSmartsets::error");
				app.currentItem = undefined;
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".smartsets-list .smartset a", function() {
			let smartset_id = $(this).parent().attr('id');
			app.arduino.addItemToSmartset(
					smartset_id,
					app.currentItem,
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					alert('bau');
					$('#manual-panel-page .smartsets-panel').css('display', 'none');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("addItemToSmartset::error");
			});
		});
		
		$("#manual-panel-page")
		.on("click", ".item .smart .off-btn", function() {
			app.arduino.setItemSmart(
					$(this).parents(".item").attr('id'),
					'false',
					$(this).parents(".item").attr('active'),
					app.currentRoom,
					app.currentProfile)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					alert('removed');
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("setItemSmart::error");
			});
		});
		
		/*$("#manual-panel-page")
		.on("click", ".add-to-new-smartset-btn", function() {
			//$.mobile.changePage('#add-edit-smartset-page', 'pop', true, true);
			$('#popup').popup('open');
		});*/
		
		
/********** EDIT ITEM *********************************************************/
		
		$("#edit-item-page .cancel-btn").click(function() {
			app.currentItem = undefined;
			app.cleanupEditItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#edit-item-page .confirm-btn").click(function() {
			var newItem = {
				"name" : app.dePrettyfy(
						$("#edit-item-page input[name=\"name\"]").val()),
				"icon" : $("#edit-item-page input[name=\"item-icons\"]:checked").val(),
				"port" : $("#edit-item-page .port-select").children("option:selected").val(),
				// TODO: other properties
			};
			
			if (newItem.name != "" && newItem.icon != undefined) {
				app.arduino.editItem(
						app.currentItem,
						newItem,
						app.currentRoom)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						//alert("Item saved successfully");

						app.currentItem = undefined;
						app.cleanupEditItemPage();
						app.changePage("#manual-panel-page");
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("editItem::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
		$("#edit-item-page .remove-btn").click(function() {
			app.arduino.removeItem(app.currentItem, app.currentRoom)
			.then(function(result) {
				var response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentItem = undefined;
					app.cleanupEditItemPage();
					app.changePage("#manual-panel-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeItem::error");
			});
		});
		
/********** ADD ITEM **********************************************************/
		
		$("#add-item-page .cancel-btn").click(function() {
			app.cleanupAddItemPage();
			app.changePage("#manual-panel-page");
		});
		
		$("#add-item-page .confirm-btn").click(function() {
			var item = {
				"name" : app.dePrettyfy(
						$("#add-item-page input[name=\"name\"]").val()),
				"icon" : $("#add-item-page input[name=\"item-icons\"]:checked").val(),
				"port" : $("#add-item-page .port-select").children("option:selected").val(),
				// TODO: other properties
			};
			
			if (item.name != "" && item.icon != undefined) {
				app.arduino.addItem(item, app.currentRoom)
				.then(function(result) {
					var response = JSON.parse(result);

					if (response.outcome == "success") {
						app.cleanupAddItemPage();
						app.changePage("#manual-panel-page");
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("addItem::error");
				});
			}
			else {
				alert("invalid data");
			}
		});
		
/********** SMARTSETS *********************************************************/
		
		$("#smartsets-page .back-btn").click(function() {
			app.changePage("#manual-panel-page");
		});
		
		$("#smartsets-page")
		.on("click", ".smartset .open-btn", function() {
			app.arduino.getSmartset(
					$(this).parent().attr('id'),
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentSmartset = response.smartset;
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartset::error");
			});
		});
		
		$("#smartsets-page")
		.on("click", ".smartset .edit-btn", function() {
			app.arduino.getSmartset(
					$(this).parent().attr('id'),
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.currentSmartset = response.smartset;
					app.changePage("#edit-smartset-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartset::error");
			});
		});
		
		$("#smartsets-page")
		.on("click", ".add-btn", function() {
			app.changePage("#add-smartset-page");
		});
		
/********** ADD SMARTSET ******************************************************/
		
		$("#add-smartset-page .cancel-btn").click(function() {
			app.changePage("#smartsets-page");
		});
		
/********** EDIT SMARTSET *****************************************************/
		
		$("#edit-smartset-page .cancel-btn").click(function() {
			app.changePage("#smartsets-page");
		});
		
		
/********** SMART ITEMS *******************************************************/
		
		$("#smart-items-page .back-btn").click(function() {
			app.changePage("#smartsets-page");
		});
			
		$('#smart-items-page')
		.on('click', '.smart-item .active-btn', function() {
			let itemData = $(this).parent();
			let item = {
				id : itemData.attr('id'),
				active : (!(itemData.attr('active') == 'true')).toString(),
			};
			
			app.arduino.addItemToSmartset(
					app.currentSmartset.id,
					item,
					app.currentProfile,
					app.currentRoom)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("addItemToSmartset::error");
			});
		});
		
		$('#smart-items-page')
		.on('click', '.smart-item .delete-btn', function() {
			let smartItemId = $(this).parent().attr('id');
			
			app.arduino.removeItemFromSmartset(
					smartItemId,
					app.currentSmartset,
					app.currentRoom,
					app.currentProfile)
			.then(function(result) {
				let response = JSON.parse(result);

				if (response.outcome == "success") {
					app.changePage("#smart-items-page");
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("removeItemFromSmartset::error");
			});
		});
		
	},
/********** FUNCTIONS *********************************************************/
	
	refreshDevices: function() {
		app.availableDevices = [];
		app.refreshDevicesContainer();

		// button() call initializes the button, preventing an error when
		// calling this function on page change
		$("#sign-in-page .submit-btn").button().button("disable");

		app.arduino.searchDevices();
		/*
		app.arduino.searchDevices()
			.then(function (result) {
				app.refreshDevices(result);
			})
			.catch(function () {
				alert("app::getDevices::error");
			});
		*/
	},
	
	refreshDevicesContainer: function() {
		var container = $(".devices-container");
		container.html("");
		
		if (app.availableDevices.length == 0) {
			container.html("<p>no smart devices found</p>");
		}
		else {
			for(var index = 0; index < app.availableDevices.length; index++) {
				container.append(
						"<label class=\"device\">" +
						app.availableDevices[index].name +
						"<input type=\"radio\" name=\"available-devices\" " +
						"device-name=\"" + app.availableDevices[index].name + "\" " +
						"address=\"" + app.availableDevices[index].address + "\">" +
						"</label>");
			}
			
			$("#sign-in-page .device").click(function() {
				$("#sign-in-page .submit-btn").button("enable");
			});
		}
		$(container).enhanceWithin();
	},
	
	/*refreshProfiles: function(profiles) {
		var container = $(".profiles-container");
		container.html("");
		
		for (let index = 0; index < profiles.length; index++) {			
			container.append(
				'<button type=\"submit\" class=\"profile\" ' +
				"name=\"" + profiles[index].name + "\">" +
				"<img src=\"img/profiles/" + profiles[index]["avatar"] +
				".png\" width=\"130px\" height=\"130px\"/>" +
				"<h3>" + profiles[index]["name"] + "</h3>" +
				"</button>");
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any profiles yet</p>");
		}
	},*/
	
	refreshProfiles: function(profiles) {
		var container = $(".profiles-container");
		container.html("");
		
		for (let index = 0; index < profiles.length; index++) {	
			let profile = profiles[index];
			container.append(
				'<button type="submit" ' +
				'id="' + profile.id + '" ' +
				'class="profile" ' +
				'">' +
				'<img src="img/profiles/' + profile.avatar +
				'.png" width="130px" height="130px"/>' +
				'<h3>' + profile.name + '</h3>' +
				'</button>');
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any profiles yet</p>");
		}
	},
	
	refreshProfileInfo: function(profile) {
		var container = $(".profile-container");
		container.html("<img src=\"img/profiles/" + profile.avatar + "\" " +
				"width=\"250px\" height=\"250px\"/> " + 
				"<h2>" + profile.name + "</h2>");
	},
	
	refreshAvatars: function(avatars) {
		var length = avatars.length;
		
		if (length > 0) {
			var container = $(".avatars-container");
			container.html("");
			
			for (let i = 0; i < length; i++) {
				container.append("<label class=\"avatar\">" +
						"<input type=\"radio\" name=\"avatars\" value=\"" +
						avatars[i] + "\">" +
						"<img src=\"img/profiles/" + avatars[i] + ".png\" " +
						"width=\"100px\" height=\"100px\">" + 
						"</label>");
			}
		}
		else {
			container.html("<p>No avatars found</p>");
		}
		
		$(container).enhanceWithin();
	},
	
	refreshRoomIcons: function(icons) {
		var length = icons.length;
		
		if (length > 0) {
			var container = $(".room-icons-container");
			container.html("");
			
			for (let index = 0; index < length; index++) {
				container.append("<label class=\"room-icon\">" +
						"<input type=\"radio\" name=\"room-icons\" value=\"" +
						icons[index] + "\">" +
						"<img src=\"img/rooms/" + icons[index] + ".png\" " +
						"width=\"100px\" height=\"100px\">" + 
						"</label>");
			}
		}
		else {
			container.html("<p>No icons found</p>");
		}
		
		$(container).enhanceWithin();
	},
	
	refreshItemIcons: function(icons) {
		var length = icons.length;
		
		if (length > 0) {
			var container = $(".item-icons-container");
			container.html("");
			
			for (let index = 0; index < length; index++) {
				container.append("<label class=\"item-icon\">" +
						"<input type=\"radio\" name=\"item-icons\" value=\"" +
						icons[index] + "\">" +
						"<img src=\"img/items/" + icons[index] + ".png\" " +
						"width=\"50px\" height=\"50px\">" + 
						"</label>");
			}
		}
		else {
			container.html("<p>No icons found</p>");
		}
		
		$(container).enhanceWithin();
	},
	
	refreshRooms: function(rooms) {
		var container = $(".rooms-container");
		container.html("");
		
		for (let index = 0; index < rooms.length; index++) {
			let room = rooms[index];
			let prettifiedName = app.prettyfy(room.name);
			container.append(
				'<div ' +
					'class="room" ' +
					'id="' + room.id + '" ' +
					'smartsets="' + room.smartsets + '" ' +
				'>' +
					'<a class="ui-btn">' +
						'<img src="img/rooms/' + room.icon +
						'.png" width="130px" height="130px"/>' +
						'<h3>' + prettifiedName + '</h3>' +
					'</a>' +
				'</div>'
			);
				
				/*'<button type="submit" ' +
				'id="' + room.id + '" ' +
				'class="room" ' +
				'smart="' + room.smart + '" ' +
				'>' +
				'<img src="img/rooms/' + room.icon +
				'.png" width="130px" height="130px"/>' +
				'<h3>' + prettifiedName + '</h3>' +
				'</button>');*/
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any rooms yet</p>");
		}
	},
	
	refreshItems: function(items) {
		var container = $(".items-list");
		container.html("");
		
		for (let index = 0; index < items.length; index++) {
			let item = items[index];
			let prettifiedName = app.prettyfy(item.name);
			
			if (index > 0) {
				container.append('<hr>');
			}
			
			container.append(
					'<div class="item" id="' + item.id +'" ' +
							'active="' + item.active + '" ' +
							'smart="' + item.smart + '">' +
						'<button type="submit" class="active-btn">' +
							'<img src="img/items/' + item.icon + '.png"' +
								' width="50px"' +
								'height="50px"/>' +
							'<h3>' + prettifiedName + '</h3>' +
						'</button>' +
						'<div class="smart-container">' +
							'<div class="smart">' +
								'<button type="submit" class="on-btn">' +
									'<p>smart on</p>' +
								'</button>' +
							'</div>' +
							'<div class="smart">' +
								'<button type="submit" class="off-btn">' +
									'<p>smart off</p>' +
								'</button>' +
							'</div>' +
						'</div>' +
					'</div>'
			);
		}
		$(container).enhanceWithin();
		
		if (container.html() == "") {
			container.html("<p>There aren't any items in this room yet</p>");
		}
	},
	
	loadSmartsetsList: function(smartsets) {
		var container = $("#smartsets-page .smartsets-list");
		container.html("");
		
		for (let index = 0; index < smartsets.length; index++) {
			let smartset = smartsets[index];
			let prettifiedName = app.prettyfy(smartset.name);
			container.append(
				'<li ' +
					'class="smartset" ' +
					'id="' + smartset.id + '" ' +
				'>' +
					'<a class="open-btn">' + prettifiedName + '</a>' +
					'<a class="edit-btn"></a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	loadSmartsets: function(smartsets) {
		var container = $("#manual-panel-page .smartsets-list");
		container.html("");
		
		for (let index = 0; index < smartsets.length; index++) {
			let smartset = smartsets[index];
			let prettifiedName = app.prettyfy(smartset.name);
			container.append(
				'<li ' +
					'class="smartset" ' +
					'id="' + smartset.id + '" ' +
				'>' +
					'<a>' + prettifiedName + '</a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	loadSmartItems: function(smartItems) {
		var container = $("#smart-items-page .smart-items-list");
		container.html("");
		
		for (let index = 0; index < smartItems.length; index++) {
			let smartItem = smartItems[index];
			container.append(
				'<li ' +
					'class="smart-item" ' +
					'id="' + smartItem.id + '" ' +
					'active="' + smartItem.active + '" ' +
				'>' +
					'<a class="active-btn">' +
						smartItem.id + ' : ' + smartItem.active +
					'</a>' +
					'<a class="delete-btn"></a>' +
				'</li>'
			);
		}
		container.listview( "refresh" );
		
		/*if (container.html() == "") {
			container.html("<p>There aren't any smartsets yet</p>");
		}*/
	},
	
	refreshPorts: function(ports) {
		var container = $("select.port-select");
		container.html("");
		
		if (app.currentItem != undefined &&
				app.currentItem.port != "none") {
			let portName = app.currentItem.port;
			container.append(
				"<option value=\"" + portName + "\">" +
				app.prettyfy(portName) + "</option>");
		}
		
		container.append("<option value=\"none\">none</option>");
		
		for (let index = 0; index < ports.length; index++) {
			let portName = ports[index].name;
			container.append(
				"<option value=\"" + portName + "\">" +
				app.prettyfy(portName) + "</option>");
		}
		
		if (container.html() != "") {
			container.prop("disabled", false);
		}
		else {
			container.prop("disabled", true);
			//container.prop("disabled", "disabled");
		}
		
		container.selectmenu().selectmenu("refresh");
		container.enhanceWithin();
	},
	
	cleanupEditProfilePage: function() {
		$("#edit-profile-page input[name=\"name\"]").val("");
		$("#edit-profile-page input[name=\"avatars\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddProfilePage: function() {
		$("#add-profile-page input[name=\"name\"]").val("");
		$("#add-profile-page input[name=\"avatars\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupEditRoomPage: function() {
		$("#edit-room-page input[name=\"name\"]").val("");
		$("#edit-room-page input[name=\"room-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddRoomPage: function() {
		$("#add-room-page input[name=\"name\"]").val("");
		$("#add-room-page input[name=\"room-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupEditItemPage: function() {
		$("#edit-item-page input[name=\"name\"]").val("");
		$("#edit-item-page input[name=\"port\"]").val("");
		$("#edit-item-page input[name=\"item-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	cleanupAddItemPage: function() {
		$("#add-item-page input[name=\"name\"]").val("");
		$("#add-item-page input[name=\"port\"]").val("");
		$("#add-item-page input[name=\"item-icons\"]")
			.prop("checked", false)
			.checkboxradio("refresh");
	},
	
	setEditProfilesMode: function(boolean) {
		if (boolean) {
			$("#profiles-page .edit-btn").val("done");
			$("#profiles-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		else {
			$("#profiles-page .edit-btn").val("edit");
			$("#profiles-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		app.EDIT_PROFILES_MODE = boolean;
	},
	
	setEditRoomsMode: function(boolean) {
		if (boolean) {
			$("#control-panel-page .edit-btn").val("done");
			$("#control-panel-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		else {
			$("#control-panel-page .edit-btn").val("edit");
			$("#control-panel-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		app.EDIT_ROOMS_MODE = boolean;
	},
	
	setEditItemsMode: function(boolean) {
		if (boolean) {
			$("#manual-panel-page .edit-btn").val("done");
			$("#manual-panel-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		else {
			$("#manual-panel-page .edit-btn").val("edit");
			$("#manual-panel-page .edit-btn").button("refresh");
			// TODO: change appearances
		}
		app.EDIT_ITEMS_MODE = boolean;
	},
	
	changePage: function(destination) {
		$.mobile.navigate(destination);
		
		switch(destination) {
				
		case "#sign-in-page":
		//case "#registerPage":
			app.refreshDevices();
			break;
				
		case "#profiles-page":
			if (app.EDIT_PROFILES_MODE) {
				app.setEditProfilesMode(false);
			}
				
			app.arduino.getProfiles()
				.then(function(result) {
					var response = JSON.parse(result);
				
					if (response.outcome == "success") {
						//alert(JSON.stringify(result));
						app.refreshProfiles(response.profiles);
					}
					else {
						alert(response.error);
					}
				})
				.catch(function() {
					alert("getProfiles::error");
				});
			break;
				
		case "#add-profile-page":
			break;
				
		case "#edit-profile-page":
			$("#edit-profile-page input[name=\"name\"]").val(
					app.currentProfile.name);
			$("#edit-profile-page input[name=\"avatars\"][value=\"" +
					app.currentProfile.avatar + "\"]")
				.prop("checked", true)
				.checkboxradio("refresh");
			break;
				
		case "#sign-in-profile-page":
			app.refreshProfileInfo(app.currentProfile);
			break;
				
		case "#control-panel-page":
			if (app.EDIT_ROOMS_MODE) {
				app.setEditRoomsMode(false);
			}
				
			app.arduino.getRooms(app.currentProfile)
			.then(function(result) {
				//alert(result);
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.refreshRooms(response.rooms);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getRooms::error");
			});
			break;
				
		case "#add-room-page":
			break;
				
		case "#edit-room-page":
			$("#edit-room-page input[name=\"name\"]").val(app.prettyfy(
					app.currentRoom.name));
			$("#edit-room-page input[name=\"room-icons\"][value=\"" +
					app.currentRoom.icon + "\"]")
				.prop("checked", true)
				.checkboxradio("refresh");
			break;
				
		case "#manual-panel-page":
			if (app.EDIT_ITEMS_MODE)
				app.setEditItemsMode(false);
				
			app.arduino.getItems(
					app.currentRoom,
					app.currentProfile)
			.then(function(result) {
				//alert(result);
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.refreshItems(response.items);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getItems::error");
			});
			break;
				
		case "#add-item-page":
			break;
				
		case "#edit-item-page":
			$("#edit-item-page input[name=\"name\"]").val(app.prettyfy(
					app.currentItem.name));
			$("#edit-item-page .port-select option[value=\"" +
					app.currentItem.port + "\"]").prop("selected", true);
			$("#edit-item-page input[name=\"item-icons\"][value=\"" +
					app.currentItem.icon + "\"]")
				.prop("checked", true)
				.checkboxradio("refresh");
			break;
			
		case "#smartsets-page":
			app.arduino.getSmartsets(app.currentProfile, app.currentRoom, "null")
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.loadSmartsetsList(response.smartsets);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartsets::error");
			});
			break;
				
		case "#edit-smartset-page":
			$("#edit-smartset-page input[name=\"name\"]").val(app.prettyfy(
					app.currentSmartset.name));
			break;
			
		case "#smart-items-page":
			app.arduino.getSmartItems(
					app.currentProfile,
					app.currentRoom,
					app.currentSmartset)
			.then(function(result) {
				var response = JSON.parse(result);
				
				if (response.outcome == "success") {
					app.loadSmartItems(response.smart_items);
				}
				else {
					alert(response.error);
				}
			})
			.catch(function() {
				alert("getSmartItems::error");
			});
			break;
		default:
		}
	},
	
	// Create the XHR object.
	createCORSRequest: function(method, url) {
		var xhr = new XMLHttpRequest();
		if (typeof (xhr.withCredentials) !== "undefined") {
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest !== "undefined") {
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			// CORS not supported.
			xhr = null;
		}
		return xhr;
	},
	
	prettyfy: function(string) {
		return string.replace(/_/g, " ");
	},
	
	dePrettyfy: function(string) {
		return string.replace(/ /g, "_");
	},
	
	
/********** ARDUINO ***********************************************************/
	
	arduino: {
		
		searchDevices: function() {
			/* search for WiFi devices and returns the list of the 
			 * currently available devices
			 */
			var networkAddress =
					$("#sign-in-page .local-ip-1").val() + "." +
					$("#sign-in-page .local-ip-2").val() + "." +
					$("#sign-in-page .local-ip-3").val() + ".";
			
			//for (var hostAddress = 1; hostAddress < 254; hostAddress++) {
			/* DEBUG */ for (var hostAddress = app.debugHost; hostAddress < app.debugHost + 1; hostAddress++) {
				//alert(protocol + "://" + networkAddress + hostAddress);
				let xhr = app.createCORSRequest(
						"GET", "http://" + networkAddress + hostAddress);
				
				if (!xhr) {
					alert("CORS not supported");
					break;
				}
				
				// response handlers
				xhr.onload = function () {
					var response = xhr.responseText;
					var title = response.match(/<title>([^<]*)/)[1];

					if (title == "Smart Home") {
						var name = response.match(/ID: ([^<]*)/)[1];
						var address = response.match(/IP address: ([^<]*)/)[1];
						var found = false;
						
						for (var index = 0;
							index < app.availableDevices.length;
							index++) {
							var currentDevice = app.availableDevices[index];
							if (currentDevice.address == address) {
								found = true;
								// overwrite
								currentDevice.name = name;
							}
						}
						if (!found) {
							app.availableDevices.push({
								"name" : name,
								"address" : address,});
							app.refreshDevicesContainer();
						}
					}
				};
				xhr.onerror = function () {};

				xhr.send();
			}
		},
		
		/*connect: function(device) {
			// TODO: connects to the selected device
			return true;
		},*/
		
		signInUser: function(/*name, password*/) {
			/* TODO: check if the user exists in the device and if the password is 
			 * correct. If the combination is correct it returns TRUE, otherwise 
			 * FALSE
			 */
			return true;
		},
		
		registerUser: function(/*name, password*/) {
			/* TODO: check if an user with the specified name already exists in 
			 * the device. If it doesn't exist it returns TRUE, otherwise FALSE
			 */
			return true;
		},
		
		signInProfile: function(/*name, password*/) {
			/* TODO: 
			 */
			return true;
		},
		
		// TODO: add "device" parameter
		/*
		getProfiles: function() {
			return new Promise((resolve, reject) => {
				return $.getJSON({
					url: "http://" + app.connectedDevice.address +
							"/profiles/",
					success: resolve,
					error: reject,
				});
			});
		},
		*/
		
		request: function(method, url, data) {
			if (data) {
				return new Promise((resolve, reject) => {
					return $.ajax({
						type: method,
						url: url,
						data: data + "\n\n",
						success: resolve,
						error: reject,
					});
				});
			}
			else {
				return new Promise((resolve, reject) => {
					return $.ajax({
						type: method,
						url: url,
						success: resolve,
						error: reject,
					});
				});
			}
		},
		
		getProfiles: function() {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/profiles/");
		},
		
		getProfile: function(profileId) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profileId);
		},
		
		getRooms: function(profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/rooms/",
					"profile_id=" + profile.id);
		},
		
		getRoom: function(roomId, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/rooms/" + roomId,
					"profile_id=" + profile.id);
		},
		
		getItems: function(room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/items/",
					"room_id=" + room.id + "&" +
							"profile_id=" + profile.id);
		},
		
		getItem: function(itemId, room, profile) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId,
					"room_id=" + room.id + "&" +
							"profile_id=" + profile.id);
		},
		
		getSmartsets: function(profile, room) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/",
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"item_id=" + 'null');
		},
		
		getSmartset: function(smartset_id, profile, room) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset_id,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&");
		},
		
		getSmartItems: function(profile, room, smartset) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smart_items/",
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"smartset_id=" + smartset.id + "&");
		},
		
		// TODO: test
		getSmartItem: function(smartItemId, profile, room, smartset) {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/smart_items/" + smartItemId,
					"profile_id=" + profile.id + "&" +
							"room_id=" + room.id + "&" +
							"smartset_id=" + smartset.id + "&");
		},
		
		getPorts: function() {
			return app.arduino.request(
					"GET",
					"http://" + app.connectedDevice.address +
							"/ports/");
		},
		
		addProfile: function(newProfile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address + "/profiles/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_profile": newProfile,
					}));
		},
		
		addRoom: function(newRoom) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_room": newRoom,
					}));
		},
		
		addItem: function(newItem, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" +
							"?action=add",
					JSON.stringify({
						"action": "add",
						"new_item": newItem,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		addSmartset: function(newSmartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" +
							"?action=add",
					JSON.stringify({
						action: "add",
						new_smartset: newSmartset,
						room_id: room.id,
						profile_id: profile.id,
					}));
		},
		
		editProfile: function(profile, newProfile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profile.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"profile_id": profile.id,
						"new_profile": newProfile,
					}));
		},
		
		editRoom: function(room, newRoom) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"room_id": room.id,
						"new_room": newRoom,
					}));
		},
		
		editItem: function(item, newItem, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + item.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"item_id": item.id,
						"new_item": newItem,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		editSmartset: function(smartset, newSmartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset.id +
							"?action=edit",
					JSON.stringify({
						"action": "edit",
						"smartset_id": smartset.id,
						"new_smartset": newSmartset,
						"room_id": room.id,
						"profile_id": profile.id,
					}));
		},
		
		removeProfile: function(profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/profiles/" + profile.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"profile_id": profile.id,
					}));
		},
		
		removeRoom: function(room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": room.id,
					}));
		},
		
		removeItem: function(item, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + item.id +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"item_id": item.id,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		removeSmartset: function(smartsetId, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartsetId +
							"?action=remove",
					JSON.stringify({
						"action": "remove",
						"room_id": room.id,
						"profile_id": profile.id,
					}));
		},
		
		setItemActive: function(itemId, itemActive, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId +
							"?action=set_status",
					JSON.stringify({
						"action": "set_status",
						"item_id": itemId,
						"item_active": itemActive,
						"room_id": room.id,
					}));
		},
		
		// TODO: test
		addItemToSmartset: function(smartset_id, item, profile, room) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset_id +
							"?action=add_item",
					JSON.stringify({
						"action": "add_item",
						item : item,
						profile_id : profile.id,
						room_id : room.id,
					}));
		},
		
		// TODO: test
		removeItemFromSmartset: function(itemId, smartset, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/smartsets/" + smartset.id +
							"?action=remove_item",
					JSON.stringify({
						"action": "remove_item",
						item_id : itemId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		// TODO: test
		activateSmartset: function(smartsetId, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=activate_smartset",
					JSON.stringify({
						"action": "activate_smartset",
						smartset_id : smartsetId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		// TODO: test
		deactivateSmartset: function(smartsetId, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + room.id +
							"?action=deactivate_smartset",
					JSON.stringify({
						"action": "deactivate_smartset",
						smartset_id : smartsetId,
						room_id : room.id,
						profile_id : profile.id,
					}));
		},
		
		/*setRoomSmart: function(roomId, roomSmart, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/rooms/" + roomId +
							"?action=set_smart",
					JSON.stringify({
						"action": "set_smart",
						"room_id": roomId,
						"room_smart": roomSmart,
						"profile_id" : profile.id,
					}));
		},*/
		
		/*setItemSmart: function(itemId, itemSmart, itemActive, room, profile) {
			return app.arduino.request(
					"POST",
					"http://" + app.connectedDevice.address +
							"/items/" + itemId +
							"?action=set_smart",
					JSON.stringify({
						"action": "set_smart",
						"item_id": itemId,
						"item_smart": itemSmart,
						"item_active": itemActive,
						"room_id": room.id,
						"profile_id" : profile.id,
					}));
		},*/
	},
};