import {ContextMenu, math} from "@xeokit/xeokit-sdk/dist/xeokit-sdk.es.js";

/**
 * @private
 */
class ObjectContextMenu extends ContextMenu {

    constructor(bimViewer, cfg = {}) {
        super(cfg);
        this._bimViewer = bimViewer;
        this._buildMenu(cfg);
    }

    _buildMenu(cfg) {

        const showObjectItems = [];
        const focusObjectItems = [];
        const measurementItems = [];

        const enableMeasurements = (!!cfg.enableMeasurements);

        if (this._bimViewer._enablePropertiesInspector) {
            showObjectItems.push(...[{
                getTitle: (context) => {
                    return context.viewer.localeService.translate("objectContextMenu.inspectProperties") || "Inspect Properties";
                },
                doAction: (context) => {
                    const objectId = context.entity.id;
                    context.bimViewer.showObjectProperties(objectId);
                }
            }]);
        }

        showObjectItems.push(...[
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("objectContextMenu.showInTree") || "Show in Explorer";
                },
                doAction: (context) => {
                    const objectId = context.entity.id;
                    context.showObjectInExplorers(objectId);
                }
            }
        ]);

        focusObjectItems.push(...[
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("objectContextMenu.viewFit") || "View Fit";
                },
                doAction: (context) => {
                    const viewer = context.viewer;
                    const scene = viewer.scene;
                    const entity = context.entity;
                    viewer.cameraFlight.flyTo({
                        aabb: entity.aabb,
                        duration: 0.5
                    }, () => {
                        setTimeout(function () {
                            scene.setObjectsHighlighted(scene.highlightedObjectIds, false);
                        }, 500);
                    });
                    viewer.cameraControl.pivotPos = math.getAABB3Center(entity.aabb);
                }
            },
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("canvasContextMenu.viewFitSelection") || "View Fit Selected";
                },
                getEnabled: (context) => {
                    return (context.viewer.scene.numSelectedObjects > 0);
                },
                doAction: (context) => {
                    const viewer = context.viewer;
                    const scene = viewer.scene;
                    const sceneAABB = scene.getAABB(scene.selectedObjectIds);
                    viewer.cameraFlight.flyTo({
                        aabb: sceneAABB,
                        duration: 0.5
                    });
                    viewer.cameraControl.pivotPos = math.getAABB3Center(sceneAABB);
                }
            },
            {
                getTitle: (context) => {
                    return context.viewer.localeService.translate("objectContextMenu.viewFitAll") || "View Fit All";
                },
                doAction: (context) => {
                    const viewer = context.viewer;
                    const scene = viewer.scene;
                    const sceneAABB = scene.getAABB(scene.visibleObjectIds);
                    viewer.cameraFlight.flyTo({
                        aabb: sceneAABB,
                        duration: 0.5
                    });
                    viewer.cameraControl.pivotPos = math.getAABB3Center(sceneAABB);
                }
            }
        ]);

        if (enableMeasurements) {
            measurementItems.push(...[{
                getTitle: (context) => {
                    return context.viewer.localeService.translate("canvasContextMenu.measurements") || "Measurements";
                },
                doAction: function (context) {
                    // Does nothing
                },
                items: [ // Sub-menu
                    [{
                        getTitle: (context) => {
                            return context.viewer.localeService.translate("canvasContextMenu.clearMeasurements") || "Clear";
                        }, getEnabled: (context) => {
                            return (context.bimViewer.getNumMeasurements() > 0);
                        }, doAction: (context) => {
                            context.bimViewer.clearMeasurements();
                        }
                    }, {
                        getTitle: (context) => {
                            return context.bimViewer.getMeasurementsAxisVisible() ? context.viewer.localeService.translate("canvasContextMenu.hideMeasurementAxisWires") || "Hide Axis Wires" : context.viewer.localeService.translate("canvasContextMenu.showMeasurementAxisWires") || "Show Axis Wires"
                        }, getEnabled: (context) => {
                            return (context.bimViewer.getNumMeasurements() > 0);
                        }, doAction: (context) => {
                            context.bimViewer.setMeasurementsAxisVisible(!context.bimViewer.getMeasurementsAxisVisible());
                        }
                    }, {
                        getTitle: (context) => {
                            return context.bimViewer.getMeasurementsSnappingEnabled() ? context.viewer.localeService.translate("canvasContextMenu.disableMeasurementSnapping") || "Disable Snapping" : context.viewer.localeService.translate("canvasContextMenu.enableMeasurementSnapping") || "Enable Snapping"
                        }, getEnabled: (context) => {
                            return (context.bimViewer.getNumMeasurements() > 0);
                        }, doAction: (context) => {
                            context.bimViewer.setMeasurementsSnappingEnabled(!context.bimViewer.getMeasurementsSnappingEnabled());
                        }
                    }]]
            }]);
        }

        this.items = [
            showObjectItems,
            focusObjectItems,
            [
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.hide") || "Hide";
                    },
                    getEnabled: (context) => {
                        return context.entity.visible;
                    },
                    doAction: (context) => {
                        context.entity.visible = false;
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.hideOthers") || "Hide Others";
                    },
                    doAction: (context) => {
                        const viewer = context.viewer;
                        const scene = viewer.scene;
                        const entity = context.entity;
                        const metaObject = viewer.metaScene.metaObjects[entity.id];
                        if (!metaObject) {
                            return;
                        }
                        scene.setObjectsVisible(scene.visibleObjectIds, false);
                        metaObject.withMetaObjectsInSubtree((metaObject) => {
                            const entity = scene.objects[metaObject.id];
                            if (entity) {
                                entity.visible = true;
                            }
                        });
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.hideAll") || "Hide All";
                    },
                    getEnabled: (context) => {
                        return (context.viewer.scene.numVisibleObjects > 0);
                    },
                    doAction: (context) => {
                        context.viewer.scene.setObjectsVisible(context.viewer.scene.visibleObjectIds, false);
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.showAll") || "Show All";
                    },
                    getEnabled: (context) => {
                        const scene = context.viewer.scene;
                        return ((scene.numVisibleObjects < scene.numObjects) || (context.viewer.scene.numXRayedObjects > 0));
                    },
                    doAction: (context) => {
                        const scene = context.viewer.scene;
                        scene.setObjectsVisible(scene.objectIds, true);
                        scene.setObjectsPickable(scene.xrayedObjectIds, true);
                        scene.setObjectsXRayed(scene.xrayedObjectIds, false);
                    }
                }
            ],
            [
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.xray") || "X-Ray";
                    },
                    getEnabled: (context) => {
                        return (!context.entity.xrayed);
                    },
                    doAction: (context) => {
                        const entity = context.entity;
                        entity.xrayed = true;
                        entity.pickable = context.bimViewer.getConfig("xrayPickable");
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.xrayOthers") || "X-Ray Others";
                    },
                    doAction: (context) => {
                        const viewer = context.viewer;
                        const scene = viewer.scene;
                        const entity = context.entity;
                        const metaObject = viewer.metaScene.metaObjects[entity.id];
                        if (!metaObject) {
                            return;
                        }
                        scene.setObjectsVisible(scene.objectIds, true);
                        scene.setObjectsXRayed(scene.objectIds, true);
                        if (!context.bimViewer.getConfig("xrayPickable")) {
                            scene.setObjectsPickable(scene.objectIds, false);
                        }
                        metaObject.withMetaObjectsInSubtree((metaObject) => {
                            const entity = scene.objects[metaObject.id];
                            if (entity) {
                                entity.xrayed = false;
                                entity.pickable = true;
                            }
                        });
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.xrayAll") || "X-Ray All";
                    },
                    getEnabled: (context) => {
                        const scene = context.viewer.scene;
                        return (scene.numXRayedObjects < scene.numObjects);
                    },
                    doAction: (context) => {
                        const scene = context.viewer.scene;
                        scene.setObjectsVisible(scene.objectIds, true);
                        if (!context.bimViewer.getConfig("xrayPickable")) {
                            scene.setObjectsPickable(scene.objectIds, false);
                        }
                        scene.setObjectsXRayed(scene.objectIds, true);
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.xrayNone") || "X-Ray None";
                    },
                    getEnabled: (context) => {
                        return (context.viewer.scene.numXRayedObjects > 0);
                    },
                    doAction: (context) => {
                        const scene = context.viewer.scene;
                        const xrayedObjectIds = scene.xrayedObjectIds;
                        scene.setObjectsPickable(xrayedObjectIds, true);
                        scene.setObjectsXRayed(xrayedObjectIds, false);
                    }
                }
            ],
            [
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.select") || "Select";
                    },
                    getEnabled: (context) => {
                        return (!context.entity.selected);
                    },
                    doAction: (context) => {
                        context.entity.selected = true;

                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.undoSelect") || "Undo Select";
                    },
                    getEnabled: (context) => {
                        return context.entity.selected;
                    },
                    doAction: (context) => {
                        context.entity.selected = false;
                    }
                },
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.selectNone") || "Select None";
                    },
                    getEnabled: (context) => {
                        return (context.viewer.scene.numSelectedObjects > 0);
                    },
                    doAction: (context) => {
                        context.viewer.scene.setObjectsSelected(context.viewer.scene.selectedObjectIds, false);
                    }
                }
            ],
            [
                {
                    getTitle: (context) => {
                        return context.viewer.localeService.translate("objectContextMenu.clearSlices") || "Clear Slices";
                    },
                    getEnabled: (context) => {
                        return (context.bimViewer.getNumSections() > 0);
                    },
                    doAction: (context) => {
                        context.bimViewer.clearSections();
                    }
                }
            ],
            measurementItems
        ];
    }
}

export {ObjectContextMenu};