import re

import pandas as pd
from datasets_.util import _get_dataset_config_names, _load_dataset
from langcodes import Language, standardize_tag

slug = "openlanguagedata/flores_plus"
splits = _get_dataset_config_names(slug)
splits.remove("default")


def flores_sentences(language) -> pd.DataFrame | None:
    if language.flores_path not in splits:
        return None
    return _load_dataset(slug, subset=language.flores_path, split="dev").to_pandas()


def aggregate_flores_paths(flores_paths):
    # takes a list of paths from the same language but different scripts
    # returns the one with the largest writing population
    if len(flores_paths) == 1:
        return flores_paths.values[0]
    populations = [
        Language.get(standardize_tag(x, macro=True)).writing_population()
        for x in flores_paths.values
    ]
    return flores_paths.values[populations.index(max(populations))]


flores = pd.DataFrame(splits, columns=["flores_path"])
flores["bcp_47"] = flores["flores_path"].apply(
    lambda x: standardize_tag(x, macro=True),
)
# ignore script (language is language)
flores["bcp_47"] = flores["bcp_47"].apply(
    lambda x: re.sub(r"-[A-Z][a-z0-9\-]+$", "", x)
)
flores = (
    flores.groupby("bcp_47").agg({"flores_path": aggregate_flores_paths}).reset_index()
)
