import {
  apply,
  FileEntry,
  forEach,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
  chain
} from "@angular-devkit/schematics";
import { join, normalize } from "path";
import { getWorkspace } from "@schematics/angular/utility/config";
import { strings } from "@angular-devkit/core";
import { dasherize } from "@angular-devkit/core/src/utils/strings";

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project = workspace.projects[options.project];
  options.path = join(normalize(project.root), "src");
  return host;
}

export function myComponent(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    setupOptions(tree, _options);

    const moveComponentPath = _options.flat
      ? normalize(_options.path)
      : normalize(
          _options.path + "/lib/components/" + dasherize(_options.name)
        );

    const templateSource = apply(url("./files/src/component"), [
      template({
        ...strings,
        ..._options
      }),
      move(moveComponentPath),
      // fix for https://github.com/angular/angular-cli/issues/11337
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      })
    ]);

    const moveStoryPath = _options.flat
      ? normalize(_options.path)
      : normalize("src/stories/" + dasherize(_options.name));

    const templateSource2 = apply(url("./files/src/story"), [
      template({
        ...strings,
        ..._options
      }),
      move(moveStoryPath),
      // fix for https://github.com/angular/angular-cli/issues/11337
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
        }
        return fileEntry;
      })
    ]);

    // const rule = mergeWith(templateSource, MergeStrategy.Overwrite);
    // const rule2 = mergeWith(templateSource2, MergeStrategy.Overwrite);

    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      mergeWith(templateSource2, MergeStrategy.Overwrite)
    ]);
  };
}
